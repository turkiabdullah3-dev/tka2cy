import { query } from '../../database/db.js';

/**
 * Retrieve tasks with optional filters and server-side pagination.
 */
export async function getTasks({ page = 1, limit = 50, status, priority, category } = {}) {
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
  if (category) {
    params.push(category);
    conditions.push(`category = $${params.length}`);
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  const countResult = await query(
    `SELECT COUNT(*) AS total FROM tasks ${whereClause}`,
    params
  );
  const total = parseInt(countResult.rows[0].total, 10);

  const dataParams = [...params, parsedLimit, offset];
  const dataResult = await query(
    `SELECT * FROM tasks
     ${whereClause}
     ORDER BY
       CASE priority WHEN 'high' THEN 1 WHEN 'medium' THEN 2 WHEN 'low' THEN 3 END,
       created_at DESC
     LIMIT $${dataParams.length - 1} OFFSET $${dataParams.length}`,
    dataParams
  );

  return {
    tasks: dataResult.rows,
    total,
    page: parsedPage,
    totalPages: Math.ceil(total / parsedLimit),
  };
}

/**
 * Create a new task.
 */
export async function createTask({ title, description, status, priority, category, due_date }) {
  const result = await query(
    `INSERT INTO tasks (title, description, status, priority, category, due_date)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [
      title,
      description || null,
      status || 'open',
      priority || 'medium',
      category || 'personal',
      due_date || null,
    ]
  );
  return result.rows[0];
}

/**
 * Update a task by ID.
 * Returns the updated row or null if not found.
 */
export async function updateTask(id, { title, description, status, priority, category, due_date }) {
  const fields = [];
  const params = [];

  if (title !== undefined) {
    params.push(title);
    fields.push(`title = $${params.length}`);
  }
  if (description !== undefined) {
    params.push(description);
    fields.push(`description = $${params.length}`);
  }
  if (status !== undefined) {
    params.push(status);
    fields.push(`status = $${params.length}`);
    if (status === 'completed') {
      fields.push(`completed_at = NOW()`);
    } else {
      fields.push(`completed_at = NULL`);
    }
  }
  if (priority !== undefined) {
    params.push(priority);
    fields.push(`priority = $${params.length}`);
  }
  if (category !== undefined) {
    params.push(category);
    fields.push(`category = $${params.length}`);
  }
  if (due_date !== undefined) {
    params.push(due_date || null);
    fields.push(`due_date = $${params.length}`);
  }

  if (fields.length === 0) {
    // Nothing to update — fetch and return current
    const current = await query('SELECT * FROM tasks WHERE id = $1', [id]);
    return current.rows[0] || null;
  }

  fields.push(`updated_at = NOW()`);
  params.push(id);

  const result = await query(
    `UPDATE tasks SET ${fields.join(', ')} WHERE id = $${params.length} RETURNING *`,
    params
  );
  return result.rows[0] || null;
}

/**
 * Delete a task by ID.
 * Returns the deleted row or null if not found.
 */
export async function deleteTask(id) {
  const result = await query(
    `DELETE FROM tasks WHERE id = $1 RETURNING *`,
    [id]
  );
  return result.rows[0] || null;
}
