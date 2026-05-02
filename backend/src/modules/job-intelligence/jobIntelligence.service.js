import { query } from '../../database/db.js';

export async function getAnalyses({ page = 1, limit = 20, fit_level, recommendation, status } = {}) {
  const parsedPage = Math.max(1, parseInt(page, 10) || 1);
  const parsedLimit = Math.min(50, Math.max(1, parseInt(limit, 10) || 20));
  const offset = (parsedPage - 1) * parsedLimit;

  const conditions = [];
  const params = [];

  if (fit_level) {
    params.push(fit_level);
    conditions.push(`ja.fit_level = $${params.length}`);
  }
  if (recommendation) {
    params.push(recommendation);
    conditions.push(`ja.recommendation = $${params.length}`);
  }
  if (status) {
    params.push(status);
    conditions.push(`ja.status = $${params.length}`);
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  const countResult = await query(
    `SELECT COUNT(*) AS total FROM job_analyses ja ${whereClause}`,
    params
  );
  const total = parseInt(countResult.rows[0].total, 10);

  const dataParams = [...params, parsedLimit, offset];
  const dataResult = await query(
    `SELECT ja.*,
            a.company AS app_company,
            a.job_title AS app_job_title,
            a.status AS app_status
     FROM job_analyses ja
     LEFT JOIN applications a ON a.id = ja.application_id
     ${whereClause}
     ORDER BY ja.created_at DESC
     LIMIT $${dataParams.length - 1} OFFSET $${dataParams.length}`,
    dataParams
  );

  return {
    analyses: dataResult.rows,
    total,
    page: parsedPage,
    totalPages: Math.ceil(total / parsedLimit),
  };
}

export async function getAnalysisById(id) {
  const result = await query(
    `SELECT ja.*,
            a.company AS app_company,
            a.job_title AS app_job_title,
            a.status AS app_status
     FROM job_analyses ja
     LEFT JOIN applications a ON a.id = ja.application_id
     WHERE ja.id = $1`,
    [id]
  );
  return result.rows[0] || null;
}

export async function createAnalysisDraft(jobDescription, applicationId) {
  const result = await query(
    `INSERT INTO job_analyses (job_description, application_id, status)
     VALUES ($1, $2, 'draft')
     RETURNING *`,
    [jobDescription, applicationId || null]
  );
  return result.rows[0];
}

export async function updateAnalysisWithResult(id, result) {
  const row = await query(
    `UPDATE job_analyses SET
       match_score = $1,
       fit_level = $2,
       strengths = $3::jsonb,
       missing_skills = $4::jsonb,
       cv_suggestions = $5::jsonb,
       recommendation = $6,
       reasoning = $7,
       model_used = $8,
       warnings = $9::jsonb,
       prompt_injection_signal = $10,
       status = 'analyzed',
       updated_at = NOW()
     WHERE id = $11
     RETURNING *`,
    [
      result.match_score,
      result.fit_level,
      JSON.stringify(result.strengths || []),
      JSON.stringify(result.missing_skills || []),
      JSON.stringify(result.cv_suggestions || []),
      result.recommendation,
      result.reasoning,
      result.model_used,
      JSON.stringify(result.warnings || []),
      result.prompt_injection_signal || false,
      id,
    ]
  );
  return row.rows[0] || null;
}

export async function markAnalysisFailed(id) {
  const result = await query(
    `UPDATE job_analyses SET status = 'failed', updated_at = NOW() WHERE id = $1 RETURNING *`,
    [id]
  );
  return result.rows[0] || null;
}

export async function updateAnalysis(id, updates) {
  const ALLOWED = ['status', 'recommendation', 'reasoning', 'application_id'];
  const setClauses = [];
  const params = [];

  for (const field of ALLOWED) {
    if (updates[field] !== undefined) {
      params.push(updates[field] === '' ? null : updates[field]);
      setClauses.push(`${field} = $${params.length}`);
    }
  }

  if (setClauses.length === 0) {
    return await getAnalysisById(id);
  }

  setClauses.push('updated_at = NOW()');
  params.push(id);

  const result = await query(
    `UPDATE job_analyses SET ${setClauses.join(', ')} WHERE id = $${params.length} RETURNING *`,
    params
  );
  return result.rows[0] || null;
}

export async function deleteAnalysis(id) {
  const result = await query('DELETE FROM job_analyses WHERE id = $1 RETURNING *', [id]);
  return result.rows[0] || null;
}
