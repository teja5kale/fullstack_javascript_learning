import React from 'react';

const rows = [
  ['HTML/CSS', 'Responsive dashboard layout, project forms', 'CSS Grid & Flexbox'],
  ['JavaScript (ES6+)', 'Form validation, placement/BOQ calculations', 'utils/calculations.js'],
  ['React', 'Components, Hooks (useState/useEffect), Router', 'src/pages/*'],
  ['Context API', 'Global units/theme/project state', 'context/AppContext.jsx'],
  ['Node.js + Express', 'REST API backend', 'backend/src/server.js'],
  ['PostgreSQL', 'Projects & cable_runs tables, CRUD', 'backend/src/models/schema.sql'],
  ['Async/Await', 'All frontend↔backend API communication', 'src/api/api.js'],
  ['Forms', 'Project configuration, cable run entry', 'ProjectForm.jsx, CableBOQ.jsx'],
];

export default function About() {
  return (
    <div>
      <h2>About This Project</h2>
      <p style={{ maxWidth: 720 }}>
        This dashboard is inspired by a Solar Design Configurator AutoCAD
        plugin used in real solar EPC workflows. Instead of generating CAD
        geometry, it re-implements the plugin's core planning logic — table
        placement, pile counts, and cable bill-of-quantities — as a
        standalone full-stack web application, built to demonstrate the
        skills covered in the Full Stack JavaScript & Frontend Engineering
        program.
      </p>

      <h3>Course-to-feature mapping</h3>
      <table className="card">
        <thead>
          <tr>
            <th>Course Topic</th>
            <th>Project Feature</th>
            <th>Where in code</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(([topic, feature, loc]) => (
            <tr key={topic}>
              <td>{topic}</td>
              <td>{feature}</td>
              <td><code>{loc}</code></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
