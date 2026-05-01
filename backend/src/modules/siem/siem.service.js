import { query } from '../../database/db.js';

/**
 * Extract the real client IP from a request object.
 * Reads X-Forwarded-For first, falls back to req.ip.
 * @param {import('express').Request} req
 * @returns {string}
 */
export function getClientIp(req) {
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) {
    // X-Forwarded-For can be a comma-separated list; the first is the client IP
    return forwarded.split(',')[0].trim();
  }
  return req.ip || 'unknown';
}

/**
 * Emit a security event into the SIEM database.
 * This function MUST NOT throw — it silently logs errors to avoid crashing the app.
 *
 * @param {Object} opts
 * @param {string} opts.source         - Origin module/system (e.g. 'auth', 'middleware')
 * @param {string} opts.event_type     - Event type constant from EVENT_TYPES
 * @param {string} opts.severity       - Severity level from SEVERITY_LEVELS
 * @param {string} [opts.ip_address]   - Client IP address
 * @param {string} [opts.user_agent]   - Client user agent string
 * @param {string} [opts.path]         - Request path
 * @param {string} [opts.method]       - HTTP method
 * @param {number} [opts.status_code]  - HTTP response status code
 * @param {string} [opts.message]      - Human-readable description
 * @param {Object} [opts.metadata]     - Additional structured data
 * @returns {Promise<Object|null>}     - Created event row or null on error
 */
export async function emitSecurityEvent({
  source,
  event_type,
  severity,
  ip_address,
  user_agent,
  path,
  method,
  status_code,
  message,
  metadata = {},
}) {
  try {
    const result = await query(
      `INSERT INTO security_events
        (source, event_type, severity, ip_address, user_agent, path, method, status_code, message, metadata)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
      [
        source,
        event_type,
        severity,
        ip_address || null,
        user_agent || null,
        path || null,
        method || null,
        status_code || null,
        message || null,
        JSON.stringify(metadata),
      ]
    );
    return result.rows[0] || null;
  } catch (err) {
    // SIEM must never crash the application
    console.error('[SIEM] Failed to emit security event:', err.message);
    return null;
  }
}

/**
 * Retrieve a paginated, filtered list of security events.
 *
 * @param {Object} opts
 * @param {number} [opts.page=1]
 * @param {number} [opts.limit=20]
 * @param {string} [opts.severity]
 * @param {string} [opts.event_type]
 * @param {string} [opts.status]
 * @param {string} [opts.source]
 * @returns {Promise<{ events: Array, total: number, page: number, totalPages: number }>}
 */
export async function getEvents({ page = 1, limit = 20, severity, event_type, status, source } = {}) {
  const parsedPage = Math.max(1, parseInt(page, 10) || 1);
  const parsedLimit = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
  const offset = (parsedPage - 1) * parsedLimit;

  const conditions = [];
  const params = [];

  if (severity) {
    params.push(severity);
    conditions.push(`severity = $${params.length}`);
  }
  if (event_type) {
    params.push(event_type);
    conditions.push(`event_type = $${params.length}`);
  }
  if (status) {
    params.push(status);
    conditions.push(`status = $${params.length}`);
  }
  if (source) {
    params.push(source);
    conditions.push(`source = $${params.length}`);
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  // Count query (no pagination)
  const countResult = await query(
    `SELECT COUNT(*) AS total FROM security_events ${whereClause}`,
    params
  );
  const total = parseInt(countResult.rows[0].total, 10);

  // Data query
  const dataParams = [...params, parsedLimit, offset];
  const dataResult = await query(
    `SELECT * FROM security_events
     ${whereClause}
     ORDER BY created_at DESC
     LIMIT $${dataParams.length - 1} OFFSET $${dataParams.length}`,
    dataParams
  );

  return {
    events: dataResult.rows,
    total,
    page: parsedPage,
    totalPages: Math.ceil(total / parsedLimit),
  };
}

/**
 * Get a summary dashboard view of security events.
 *
 * @returns {Promise<Object>}
 */
export async function getSummary() {
  const [
    totalResult,
    bySeverityResult,
    byTypeResult,
    recentResult,
    statusResult,
  ] = await Promise.all([
    // Total events count
    query('SELECT COUNT(*) AS total FROM security_events'),

    // Events by severity
    query(
      `SELECT severity, COUNT(*) AS count
       FROM security_events
       GROUP BY severity
       ORDER BY CASE severity
         WHEN 'critical' THEN 1
         WHEN 'high' THEN 2
         WHEN 'medium' THEN 3
         WHEN 'low' THEN 4
         WHEN 'info' THEN 5
       END`
    ),

    // Events by type (top 10)
    query(
      `SELECT event_type, COUNT(*) AS count
       FROM security_events
       GROUP BY event_type
       ORDER BY count DESC
       LIMIT 10`
    ),

    // Recent events (last 10)
    query(
      `SELECT * FROM security_events
       ORDER BY created_at DESC
       LIMIT 10`
    ),

    // Open vs resolved counts
    query(
      `SELECT status, COUNT(*) AS count
       FROM security_events
       GROUP BY status`
    ),
  ]);

  const statusCounts = { open: 0, resolved: 0 };
  for (const row of statusResult.rows) {
    statusCounts[row.status] = parseInt(row.count, 10);
  }

  return {
    total: parseInt(totalResult.rows[0].total, 10),
    bySeverity: bySeverityResult.rows.map((r) => ({
      severity: r.severity,
      count: parseInt(r.count, 10),
    })),
    byType: byTypeResult.rows.map((r) => ({
      event_type: r.event_type,
      count: parseInt(r.count, 10),
    })),
    recentEvents: recentResult.rows,
    statusCounts,
  };
}

/**
 * Mark a security event as resolved.
 *
 * @param {string} id - UUID of the event
 * @returns {Promise<Object|null>} - Updated event row or null if not found
 */
export async function resolveEvent(id) {
  const result = await query(
    `UPDATE security_events
     SET status = 'resolved', resolved_at = NOW()
     WHERE id = $1
     RETURNING *`,
    [id]
  );
  return result.rows[0] || null;
}
