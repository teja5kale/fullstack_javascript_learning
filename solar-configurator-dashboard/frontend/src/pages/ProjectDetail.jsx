import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../api/api';

export default function ProjectDetail() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all([api.getProject(id), api.getProjectSummary(id)])
      .then(([projectData, summaryData]) => {
        setProject(projectData);
        setSummary(summaryData);
      })
      .catch((err) => setError(err.message));
  }, [id]);

  if (error) return <p className="field-error">{error}</p>;
  if (!project) return <p>Loading…</p>;

  const { placement, piles } = summary || { placement: {}, piles: {} };

  return (
    <div>
      <div className="topbar">
        <h2>{project.name}</h2>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Link className="btn btn-secondary" to={`/projects/${id}/edit`}>
            Edit
          </Link>
          <Link className="btn btn-secondary" to={`/projects/${id}/layout`}>
            View Layout
          </Link>
          <Link className="btn" to={`/projects/${id}/cables`}>
            Cable BOQ
          </Link>
        </div>
      </div>

      <div className="card">
        <p>
          <strong>Location:</strong> {project.location || '—'} &nbsp;·&nbsp;
          <strong> Capacity:</strong> {project.capacity_mw} MW &nbsp;·&nbsp;
          <strong> Table Type:</strong> {project.table_type} &nbsp;·&nbsp;
          <strong> Status:</strong> {project.status}
        </p>
      </div>

      <h3>Layout Calculation (auto-generated)</h3>
      <div className="stats-grid">
        <div className="stat-box">
          <div className="value">{placement.rows ?? '—'}</div>
          <div>Rows</div>
        </div>
        <div className="stat-box">
          <div className="value">{placement.columns ?? '—'}</div>
          <div>Columns</div>
        </div>
        <div className="stat-box">
          <div className="value">{placement.totalTables ?? '—'}</div>
          <div>Total Tables</div>
        </div>
        <div className="stat-box">
          <div className="value">{piles.totalPiles ?? '—'}</div>
          <div>Total Piles</div>
        </div>
      </div>

      <p style={{ color: 'var(--muted)' }}>
        Calculation mirrors the plugin's <em>Place Tables</em> and{' '}
        <em>Place Piles</em> logic: tables are packed inside the boundary
        (minus setback) using pitch spacing on both axes, then piles are
        assigned per table.
      </p>
    </div>
  );
}
