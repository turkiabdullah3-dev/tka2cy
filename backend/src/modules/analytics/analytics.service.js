import { query } from '../../database/db.js';

/**
 * Record a public analytics event into the analytics_events table.
 * Must not throw — silently logs failures.
 */
export async function recordAnalyticsEvent({
  event_type,
  page,
  visitor_id,
  session_id,
  ip_address,
  user_agent,
  referrer,
  metadata = {},
}) {
  try {
    const result = await query(
      `INSERT INTO analytics_events
        (event_type, page, visitor_id, session_id, ip_address, user_agent, referrer, metadata)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [
        event_type,
        page || null,
        visitor_id || null,
        session_id || null,
        ip_address || null,
        user_agent || null,
        referrer || null,
        JSON.stringify(metadata),
      ]
    );
    return result.rows[0] || null;
  } catch (err) {
    console.error('[Analytics] Failed to record event:', err.message);
    return null;
  }
}

/**
 * Return a summary dashboard view of analytics events.
 */
export async function getAnalyticsSummary() {
  const [
    totalResult,
    uniqueVisitorsResult,
    byTypeResult,
    topPagesResult,
    recentResult,
    dailyResult,
  ] = await Promise.all([
    query('SELECT COUNT(*) AS total FROM analytics_events'),

    query(
      `SELECT COUNT(DISTINCT COALESCE(visitor_id, ip_address)) AS unique_visitors
       FROM analytics_events
       WHERE event_type = 'page_view'`
    ),

    query(
      `SELECT event_type, COUNT(*) AS count
       FROM analytics_events
       GROUP BY event_type
       ORDER BY count DESC
       LIMIT 20`
    ),

    query(
      `SELECT page, COUNT(*) AS count
       FROM analytics_events
       WHERE page IS NOT NULL AND event_type = 'page_view'
       GROUP BY page
       ORDER BY count DESC
       LIMIT 10`
    ),

    query(
      `SELECT * FROM analytics_events
       ORDER BY created_at DESC
       LIMIT 20`
    ),

    query(
      `SELECT DATE(created_at) AS date, COUNT(*) AS count
       FROM analytics_events
       WHERE event_type = 'page_view'
         AND created_at >= NOW() - INTERVAL '30 days'
       GROUP BY DATE(created_at)
       ORDER BY date ASC`
    ),
  ]);

  const byTypeCounts = Object.fromEntries(
    byTypeResult.rows.map((r) => [r.event_type, parseInt(r.count, 10)])
  );

  return {
    total: parseInt(totalResult.rows[0].total, 10),
    pageViews: byTypeCounts['page_view'] || 0,
    uniqueVisitors: parseInt(uniqueVisitorsResult.rows[0].unique_visitors, 10) || 0,
    cvDownloads: byTypeCounts['cv_download'] || 0,
    contactSubmissions: byTypeCounts['contact_form_submit'] || 0,
    byType: byTypeResult.rows.map((r) => ({
      event_type: r.event_type,
      count: parseInt(r.count, 10),
    })),
    topPages: topPagesResult.rows.map((r) => ({
      page: r.page,
      count: parseInt(r.count, 10),
    })),
    recentEvents: recentResult.rows,
    dailyPageViews: dailyResult.rows.map((r) => ({
      date: r.date,
      count: parseInt(r.count, 10),
    })),
  };
}

/**
 * Retrieve a paginated list of analytics events.
 */
export async function getAnalyticsEvents({
  page = 1,
  limit = 20,
  event_type,
  page: eventPage,
} = {}) {
  const parsedPage = Math.max(1, parseInt(page, 10) || 1);
  const parsedLimit = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
  const offset = (parsedPage - 1) * parsedLimit;

  const conditions = [];
  const params = [];

  if (event_type) {
    params.push(event_type);
    conditions.push(`event_type = $${params.length}`);
  }
  if (eventPage) {
    params.push(`%${eventPage}%`);
    conditions.push(`page ILIKE $${params.length}`);
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  const countResult = await query(
    `SELECT COUNT(*) AS total FROM analytics_events ${whereClause}`,
    params
  );
  const total = parseInt(countResult.rows[0].total, 10);

  const dataParams = [...params, parsedLimit, offset];
  const dataResult = await query(
    `SELECT * FROM analytics_events
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
