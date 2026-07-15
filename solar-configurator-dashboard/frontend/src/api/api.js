const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed with status ${res.status}`);
  }

  if (res.status === 204) return null;
  return res.json();
}

export const api = {
  // Projects
  getProjects: () => request('/projects'),
  getProject: (id) => request(`/projects/${id}`),
  createProject: (data) =>
    request('/projects', { method: 'POST', body: JSON.stringify(data) }),
  updateProject: (id, data) =>
    request(`/projects/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteProject: (id) => request(`/projects/${id}`, { method: 'DELETE' }),
  getProjectSummary: (id) => request(`/projects/${id}/summary`),

  // Cable runs
  getCableRuns: (projectId) => request(`/projects/${projectId}/cables`),
  addCableRun: (projectId, data) =>
    request(`/projects/${projectId}/cables`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  getCableBOQ: (projectId) => request(`/projects/${projectId}/cables/boq`),
  deleteCableRun: (cableId) => request(`/cables/${cableId}`, { method: 'DELETE' }),
};
