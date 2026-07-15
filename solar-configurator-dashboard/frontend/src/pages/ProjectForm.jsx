import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../api/api';

const emptyForm = {
  name: '',
  location: '',
  capacity_mw: '',
  table_type: 'Fixed Tilt',
  table_width_m: '2',
  table_length_m: '4',
  pitch1_m: '7',
  pitch2_m: '5',
  boundary_width_m: '200',
  boundary_height_m: '150',
  setback_m: '3',
  piles_per_table: '4',
  status: 'Draft',
};

function validate(form) {
  const errors = {};
  if (!form.name.trim()) errors.name = 'Project name is required.';
  if (!form.capacity_mw || Number(form.capacity_mw) <= 0)
    errors.capacity_mw = 'Capacity must be a positive number.';
  if (Number(form.pitch1_m) <= Number(form.table_width_m))
    errors.pitch1_m = 'Pitch 1 should be greater than table width to avoid overlap.';
  if (Number(form.boundary_width_m) <= 0 || Number(form.boundary_height_m) <= 0)
    errors.boundary_width_m = 'Boundary dimensions must be positive.';
  return errors;
}

export default function ProjectForm({ mode }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [loadError, setLoadError] = useState(null);

  useEffect(() => {
    if (mode === 'edit' && id) {
      api
        .getProject(id)
        .then((data) =>
          setForm({
            ...data,
            capacity_mw: String(data.capacity_mw),
            table_width_m: String(data.table_width_m),
            table_length_m: String(data.table_length_m),
            pitch1_m: String(data.pitch1_m),
            pitch2_m: String(data.pitch2_m),
            boundary_width_m: String(data.boundary_width_m),
            boundary_height_m: String(data.boundary_height_m),
            setback_m: String(data.setback_m),
            piles_per_table: String(data.piles_per_table),
          })
        )
        .catch((err) => setLoadError(err.message));
    }
  }, [mode, id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate(form);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setSubmitting(true);
    try {
      if (mode === 'create') {
        const created = await api.createProject(form);
        navigate(`/projects/${created.id}`);
      } else {
        await api.updateProject(id, form);
        navigate(`/projects/${id}`);
      }
    } catch (err) {
      setLoadError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h2>{mode === 'create' ? 'New Project' : 'Edit Project'}</h2>
      {loadError && <p className="field-error">{loadError}</p>}

      <form className="card" onSubmit={handleSubmit}>
        <div className="form-row">
          <label>
            Project Name
            <input name="name" value={form.name} onChange={handleChange} />
            {errors.name && <span className="field-error">{errors.name}</span>}
          </label>
          <label>
            Location
            <input name="location" value={form.location} onChange={handleChange} />
          </label>
          <label>
            Capacity (MW)
            <input
              type="number"
              name="capacity_mw"
              value={form.capacity_mw}
              onChange={handleChange}
              step="0.1"
            />
            {errors.capacity_mw && (
              <span className="field-error">{errors.capacity_mw}</span>
            )}
          </label>
        </div>

        <div className="form-row">
          <label>
            Table Type
            <select name="table_type" value={form.table_type} onChange={handleChange}>
              <option>Fixed Tilt</option>
              <option>Tracker</option>
            </select>
          </label>
          <label>
            Table Width (m)
            <input
              type="number"
              name="table_width_m"
              value={form.table_width_m}
              onChange={handleChange}
              step="0.1"
            />
          </label>
          <label>
            Table Length (m)
            <input
              type="number"
              name="table_length_m"
              value={form.table_length_m}
              onChange={handleChange}
              step="0.1"
            />
          </label>
        </div>

        <div className="form-row">
          <label>
            Pitch 1 (m)
            <input
              type="number"
              name="pitch1_m"
              value={form.pitch1_m}
              onChange={handleChange}
              step="0.1"
            />
            {errors.pitch1_m && <span className="field-error">{errors.pitch1_m}</span>}
          </label>
          <label>
            Pitch 2 (m)
            <input
              type="number"
              name="pitch2_m"
              value={form.pitch2_m}
              onChange={handleChange}
              step="0.1"
            />
          </label>
          <label>
            Setback (m)
            <input
              type="number"
              name="setback_m"
              value={form.setback_m}
              onChange={handleChange}
              step="0.1"
            />
          </label>
        </div>

        <div className="form-row">
          <label>
            Boundary Width (m)
            <input
              type="number"
              name="boundary_width_m"
              value={form.boundary_width_m}
              onChange={handleChange}
            />
            {errors.boundary_width_m && (
              <span className="field-error">{errors.boundary_width_m}</span>
            )}
          </label>
          <label>
            Boundary Height (m)
            <input
              type="number"
              name="boundary_height_m"
              value={form.boundary_height_m}
              onChange={handleChange}
            />
          </label>
          <label>
            Piles per Table
            <input
              type="number"
              name="piles_per_table"
              value={form.piles_per_table}
              onChange={handleChange}
            />
          </label>
        </div>

        <label>
          Status
          <select name="status" value={form.status} onChange={handleChange}>
            <option>Draft</option>
            <option>In Review</option>
            <option>Approved</option>
          </select>
        </label>

        <div>
          <button className="btn" type="submit" disabled={submitting}>
            {submitting ? 'Saving…' : 'Save Project'}
          </button>
        </div>
      </form>
    </div>
  );
}
