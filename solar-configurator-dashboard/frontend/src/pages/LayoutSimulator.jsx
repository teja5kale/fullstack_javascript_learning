import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../api/api';

export default function LayoutSimulator() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all([api.getProject(id), api.getProjectSummary(id)])
      .then(([p, s]) => {
        setProject(p);
        setSummary(s);
      })
      .catch((err) => setError(err.message));
  }, [id]);

  if (error) return <p className="field-error">{error}</p>;
  if (!project || !summary) return <p>Loading…</p>;

  const { rows, columns, totalTables } = summary.placement;

  return (
    <div>
      <h2>Layout Simulator — {project.name}</h2>
      <p style={{ color: 'var(--muted)' }}>
        Simplified 2D grid preview of the table array. Each block represents
        one {project.table_type} table, spaced according to your pitch
        settings. This is a schematic simulation, not a survey-accurate CAD
        layout.
      </p>

      {totalTables === 0 ? (
        <div className="card empty-state">
          No tables fit with the current boundary/pitch settings. Try
          increasing the boundary size or reducing pitch/setback.
        </div>
      ) : (
        <div
          className="layout-grid-preview"
          style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
        >
          {Array.from({ length: rows * columns }).map((_, idx) => (
            <div key={idx} className="layout-cell" title={`Table ${idx + 1}`} />
          ))}
        </div>
      )}

      <div className="stats-grid">
        <div className="stat-box">
          <div className="value">{rows}</div>
          <div>Rows</div>
        </div>
        <div className="stat-box">
          <div className="value">{columns}</div>
          <div>Columns</div>
        </div>
        <div className="stat-box">
          <div className="value">{totalTables}</div>
          <div>Tables</div>
        </div>
      </div>
    </div>
  );
}
