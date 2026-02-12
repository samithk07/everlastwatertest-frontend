import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const waterTestAPI = {
  getAll: () => axios.get(`${API_URL}/watertests`),
  getById: (id) => axios.get(`${API_URL}/watertests/${id}`),
  create: (data) => axios.post(`${API_URL}/watertests`, data),
  update: (id, data) => axios.patch(`${API_URL}/watertests/${id}`, data),
  delete: (id) => axios.delete(`${API_URL}/watertests/${id}`),
  search: (query) => axios.get(`${API_URL}/watertests?q=${query}`)
};