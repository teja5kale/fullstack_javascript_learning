const pool = require('../db');
const { summarizeProject, calculateCableBOQ } = require('../utils/calculations');

// GET /api/projects
async function listProjects(req, res) {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM projects ORDER BY updated_at DESC'
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
}

// GET /api/projects/:id
async function getProject(req, res) {
  try {
    const { rows } = await pool.query('SELECT * FROM projects WHERE id = $1', [
      req.params.id,
    ]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch project' });
  }
}

// POST /api/projects
async function createProject(req, res) {
  const {
    name,
    location,
    capacity_mw,
    table_type,
    table_width_m,
    table_length_m,
    pitch1_m,
    pitch2_m,
    boundary_width_m,
    boundary_height_m,
    setback_m,
    piles_per_table,
    status,
  } = req.body;

  if (!name || !capacity_mw || !table_type) {
    return res
      .status(400)
      .json({ error: 'name, capacity_mw, and table_type are required' });
  }

  try {
    const { rows } = await pool.query(
      `INSERT INTO projects
        (name, location, capacity_mw, table_type, table_width_m, table_length_m,
         pitch1_m, pitch2_m, boundary_width_m, boundary_height_m, setback_m,
         piles_per_table, status)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
       RETURNING *`,
      [
        name,
        location,
        capacity_mw,
        table_type,
        table_width_m,
        table_length_m,
        pitch1_m,
        pitch2_m,
        boundary_width_m,
        boundary_height_m,
        setback_m || 3,
        piles_per_table || 4,
        status || 'Draft',
      ]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create project' });
  }
}

// PUT /api/projects/:id
async function updateProject(req, res) {
  const fields = [
    'name', 'location', 'capacity_mw', 'table_type', 'table_width_m',
    'table_length_m', 'pitch1_m', 'pitch2_m', 'boundary_width_m',
    'boundary_height_m', 'setback_m', 'piles_per_table', 'status',
  ];

  const updates = [];
  const values = [];
  let i = 1;

  fields.forEach((field) => {
    if (req.body[field] !== undefined) {
      updates.push(`${field} = $${i}`);
      values.push(req.body[field]);
      i += 1;
    }
  });

  if (updates.length === 0) {
    return res.status(400).json({ error: 'No fields provided to update' });
  }

  updates.push('updated_at = NOW()');
  values.push(req.params.id);

  try {
    const { rows } = await pool.query(
      `UPDATE projects SET ${updates.join(', ')} WHERE id = $${i} RETURNING *`,
      values
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update project' });
  }
}

// DELETE /api/projects/:id
async function deleteProject(req, res) {
  try {
    const { rowCount } = await pool.query('DELETE FROM projects WHERE id = $1', [
      req.params.id,
    ]);
    if (rowCount === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.status(204).end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete project' });
  }
}

// GET /api/projects/:id/summary — table/pile placement calculation (BOQ-style)
async function getProjectSummary(req, res) {
  try {
    const { rows } = await pool.query('SELECT * FROM projects WHERE id = $1', [
      req.params.id,
    ]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json(summarizeProject(rows[0]));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to calculate project summary' });
  }
}

// GET /api/projects/:id/cables
async function listCableRuns(req, res) {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM cable_runs WHERE project_id = $1 ORDER BY created_at DESC',
      [req.params.id]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch cable runs' });
  }
}

// POST /api/projects/:id/cables
async function addCableRun(req, res) {
  const { cable_type, routing, avg_length_m, count, cost_per_meter } = req.body;

  if (!cable_type || !routing || !avg_length_m || !count) {
    return res.status(400).json({
      error: 'cable_type, routing, avg_length_m, and count are required',
    });
  }

  try {
    const { rows } = await pool.query(
      `INSERT INTO cable_runs
        (project_id, cable_type, routing, avg_length_m, count, cost_per_meter)
       VALUES ($1,$2,$3,$4,$5,$6)
       RETURNING *`,
      [req.params.id, cable_type, routing, avg_length_m, count, cost_per_meter || 0]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add cable run' });
  }
}

// GET /api/projects/:id/cables/boq — aggregated cable BOQ
async function getCableBOQ(req, res) {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM cable_runs WHERE project_id = $1',
      [req.params.id]
    );
    const runs = rows.map((r) => ({
      cableType: r.cable_type,
      routing: r.routing,
      avgLengthM: r.avg_length_m,
      count: r.count,
      costPerMeter: r.cost_per_meter,
    }));
    res.json(calculateCableBOQ(runs));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to calculate cable BOQ' });
  }
}

// DELETE /api/cables/:cableId
async function deleteCableRun(req, res) {
  try {
    const { rowCount } = await pool.query('DELETE FROM cable_runs WHERE id = $1', [
      req.params.cableId,
    ]);
    if (rowCount === 0) {
      return res.status(404).json({ error: 'Cable run not found' });
    }
    res.status(204).end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete cable run' });
  }
}

module.exports = {
  listProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  getProjectSummary,
  listCableRuns,
  addCableRun,
  getCableBOQ,
  deleteCableRun,
};
