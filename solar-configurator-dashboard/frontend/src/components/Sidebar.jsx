import React from 'react';
import { NavLink } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const links = [
  { to: '/', label: 'Dashboard' },
  { to: '/projects/new', label: 'New Project' },
  { to: '/about', label: 'About / Plugin Mapping' },
];

export default function Sidebar() {
  const { theme, toggleTheme, units, toggleUnits } = useApp();

  return (
    <aside className="sidebar">
      <h1>☀️ Solar Configurator</h1>
      {links.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          end={link.to === '/'}
          className={({ isActive }) => (isActive ? 'active' : '')}
        >
          {link.label}
        </NavLink>
      ))}

      <div style={{ marginTop: 'auto', paddingTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <button className="btn btn-secondary" onClick={toggleUnits}>
          Units: {units === 'meters' ? 'Meters' : 'Feet'}
        </button>
        <button className="btn btn-secondary" onClick={toggleTheme}>
          {theme === 'light' ? '🌙 Dark mode' : '☀️ Light mode'}
        </button>
      </div>
    </aside>
  );
}
