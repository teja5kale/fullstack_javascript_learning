import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import ProjectForm from './pages/ProjectForm';
import ProjectDetail from './pages/ProjectDetail';
import LayoutSimulator from './pages/LayoutSimulator';
import CableBOQ from './pages/CableBOQ';
import About from './pages/About';

function Shell() {
  const { theme } = useApp();
  return (
    <div className="app-shell" data-theme={theme}>
      <Sidebar />
      <main className="main">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/projects/new" element={<ProjectForm mode="create" />} />
          <Route path="/projects/:id/edit" element={<ProjectForm mode="edit" />} />
          <Route path="/projects/:id" element={<ProjectDetail />} />
          <Route path="/projects/:id/layout" element={<LayoutSimulator />} />
          <Route path="/projects/:id/cables" element={<CableBOQ />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Shell />
      </BrowserRouter>
    </AppProvider>
  );
}
