import { query } from '../../database/db.js';

const ALLOWED_FIELDS = [
  'company', 'job_title', 'job_url', 'location', 'source',
  'status', 'priority', 'job_description', 'notes', 'applied_at', 'follow_up_at',
];

export async function getApplications({ page = 1, limit = 50, status, priority, source, search } = {}) {
  const parsedPage = Math.max(1, parseInt(page, 10) || 1);
  const parsedLimit = Math.min(100, Math.max(1, parseInt(limit, 10) || 50));
  const offset = (parsedPage - 1) * parsedLimit;

  const conditions = [];
  const params = [];

  if (status) {
    params.push(status);
    conditions.push(`status = $${params.length}`);
  }
  if (priority) {
    params.push(priority);
    conditions.push(`priority = $${params.length}`);
  }
  if (source) {
    params.push(source);
    conditions.push(`source = $${params.length}`);
  }
  if (search) {
    params.push(`%${search}%`);
    const idx = params.length;
    conditions.push(
      `(company ILIKE $${idx} OR job_title ILIKE $${idx} OR location ILIKE $${idx} OR notes ILIKE $${idx})`
    );
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  const countResult = await query(
    `SELECT COUNT(*) AS total FROM applications ${whereClause}`,
    params
  );
  const total = parseInt(countResult.rows[0].total, 10);

  const dataParams = [...params, parsedLimit, offset];
  const dataResult = await query(
    `SELECT * FROM applications
     ${whereClause}
     ORDER BY
       CASE priority WHEN 'high' THEN 1 WHEN 'medium' THEN 2 WHEN 'low' THEN 3 END,
       created_at DESC
     LIMIT $${dataParams.length - 1} OFFSET $${dataParams.length}`,
    dataParams
  );

  return {
    applications: dataResult.rows,
    total,
    page: parsedPage,
    totalPages: Math.ceil(total / parsedLimit),
  };
}

export async function getApplicationStats() {
  const result = await query(`
    SELECT
      COUNT(*) AS total,
      COUNT(*) FILTER (WHERE status = 'saved') AS saved,
      COUNT(*) FILTER (WHERE status = 'applied') AS applied,
      COUNT(*) FILTER (WHERE status = 'interview') AS interviews,
      COUNT(*) FILTER (
        WHERE follow_up_at IS NOT NULL
          AND follow_up_at <= NOW()
          AND status NOT IN ('rejected', 'withdrawn')
      ) AS follow_ups_due
    FROM applications
  `);
  const row = result.rows[0];
  return {
    total: parseInt(row.total, 10),
    saved: parseInt(row.saved, 10),
    applied: parseInt(row.applied, 10),
    interviews: parseInt(row.interviews, 10),
    followUpsDue: parseInt(row.follow_ups_due, 10),
  };
}

export async function getApplicationById(id) {
  const result = await query('SELECT * FROM applications WHERE id = $1', [id]);
  return result.rows[0] || null;
}

export async function createApplication(data) {
  const result = await query(
    `INSERT INTO applications
       (company, job_title, job_url, location, source, status, priority, job_description, notes, applied_at, follow_up_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
     RETURNING *`,
    [
      data.company,
      data.job_title,
      data.job_url || null,
      data.location || null,
      data.source || 'manual',
      data.status || 'saved',
      data.priority || 'medium',
      data.job_description || null,
      data.notes || null,
      data.applied_at || null,
      data.follow_up_at || null,
    ]
  );
  return result.rows[0];
}

export async function updateApplication(id, updates) {
  const setClauses = [];
  const params = [];

  for (const field of ALLOWED_FIELDS) {
    if (updates[field] !== undefined) {
      params.push(updates[field] === '' ? null : updates[field]);
      setClauses.push(`${field} = $${params.length}`);
    }
  }

  if (setClauses.length === 0) {
    const current = await query('SELECT * FROM applications WHERE id = $1', [id]);
    return current.rows[0] || null;
  }

  setClauses.push('updated_at = NOW()');
  params.push(id);

  const result = await query(
    `UPDATE applications SET ${setClauses.join(', ')} WHERE id = $${params.length} RETURNING *`,
    params
  );
  return result.rows[0] || null;
}

export async function deleteApplication(id) {
  const result = await query('DELETE FROM applications WHERE id = $1 RETURNING *', [id]);
  return result.rows[0] || null;
}
