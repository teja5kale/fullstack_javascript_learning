import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../api/api';

const emptyRun = {
  cable_type: 'LT',
  routing: 'Above Ground',
  avg_length_m: '',
  count: '',
  cost_per_meter: '',
};

export default function CableBOQ() {
  const { id } = useParams();
  const [runs, setRuns] = useState([]);
  const [boq, setBoq] = useState(null);
  const [form, setForm] = useState(emptyRun);
  const [error, setError] = useState(null);

  const load = async () => {
    try {
      const [runsData, boqData] = await Promise.all([
        api.getCableRuns(id),
        api.getCableBOQ(id),
      ]);
      setRuns(runsData);
      setBoq(boqData);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.avg_length_m || !form.count) {
      setError('Average length and count are required.');
      return;
    }
    setError(null);
    try {
      await api.addCableRun(id, form);
      setForm(emptyRun);
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (cableId) => {
    await api.deleteCableRun(cableId);
    load();
  };

  return (
    <div>
      <h2>Cable BOQ</h2>
      {error && <p className="field-error">{error}</p>}

      <form className="card" onSubmit={handleAdd}>
        <div className="form-row">
          <label>
            Cable Type
            <select name="cable_type" value={form.cable_type} onChange={handleChange}>
              <option>LT</option>
              <option>DC</option>
              <option>HT</option>
            </select>
          </label>
          <label>
            Routing
            <select name="routing" value={form.routing} onChange={handleChange}>
              <option>Above Ground</option>
              <option>Underground</option>
            </select>
          </label>
          <label>
            Avg. Length (m)
            <input
              type="number"
              name="avg_length_m"
              value={form.avg_length_m}
              onChange={handleChange}
            />
          </label>
          <label>
            Run Count
            <input type="number" name="count" value={form.count} onChange={handleChange} />
          </label>
          <label>
            Cost / meter
            <input
              type="number"
              name="cost_per_meter"
              value={form.cost_per_meter}
              onChange={handleChange}
            />
          </label>
        </div>
        <div>
          <button className="btn" type="submit">
            Add Cable Run
          </button>
        </div>
      </form>

      <h3 style={{ marginTop: '1.5rem' }}>Recorded Runs</h3>
      {runs.length === 0 ? (
        <p className="empty-state">No cable runs recorded yet.</p>
      ) : (
        <table className="card">
          <thead>
            <tr>
              <th>Type</th>
              <th>Routing</th>
              <th>Avg Length (m)</th>
              <th>Count</th>
              <th>Cost/m</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {runs.map((r) => (
              <tr key={r.id}>
                <td>{r.cable_type}</td>
                <td>{r.routing}</td>
                <td>{r.avg_length_m}</td>
                <td>{r.count}</td>
                <td>{r.cost_per_meter}</td>
                <td>
                  <button className="btn btn-danger" onClick={() => handleDelete(r.id)}>
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {boq && (
        <>
          <h3 style={{ marginTop: '1.5rem' }}>Aggregated BOQ</h3>
          <div className="stats-grid">
            <div className="stat-box">
              <div className="value">{boq.totalLength} m</div>
              <div>Total Cable Length</div>
            </div>
            <div className="stat-box">
              <div className="value">₹{boq.totalCost}</div>
              <div>Estimated Cost</div>
            </div>
          </div>
          <div className="card">
            {Object.entries(boq.byType).map(([type, length]) => (
              <div key={type} className="flex-between">
                <span>{type}</span>
                <strong>{length} m</strong>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
