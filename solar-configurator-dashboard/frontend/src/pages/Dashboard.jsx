import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { api } from '../api/api';

const badgeClass = {
  Draft: 'badge-draft',
  'In Review': 'badge-review',
  Approved: 'badge-approved',
};

export default function Dashboard() {
  const { projects, loading, error, refreshProjects } = useApp();

  useEffect(() => {
    refreshProjects();
  }, [refreshProjects]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this project? This cannot be undone.')) return;
    await api.deleteProject(id);
    refreshProjects();
  };

  return (
    <div>
      <div className="topbar">
        <h2>Plant Projects</h2>
        <Link className="btn" to="/projects/new">
          + New Project
        </Link>
      </div>

      {loading && <p>Loading projects…</p>}
      {error && <p className="field-error">{error}</p>}

      {!loading && projects.length === 0 && (
        <div className="empty-state card">
          No projects yet. Create your first solar plant layout to get started.
        </div>
      )}

      <div className="grid-cards">
        {projects.map((p) => (
          <div key={p.id} className="card project-card">
            <div className="flex-between">
              <h3>{p.name}</h3>
              <span className={`badge ${badgeClass[p.status] || 'badge-draft'}`}>
                {p.status}
              </span>
            </div>
            <p style={{ color: 'var(--muted)', margin: '0 0 0.75rem' }}>
              {p.location || 'No location set'} · {p.capacity_mw} MW · {p.table_type}
            </p>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <Link className="btn btn-secondary" to={`/projects/${p.id}`}>
                View
              </Link>
              <Link className="btn btn-secondary" to={`/projects/${p.id}/edit`}>
                Edit
              </Link>
              <button className="btn btn-danger" onClick={() => handleDelete(p.id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
