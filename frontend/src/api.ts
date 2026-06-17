import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api'
});

api.interceptors.request.use(config => {
  const studentAuth = localStorage.getItem('campuscart-auth');
  const adminAuth = localStorage.getItem('campuscart-admin');

  const isAdminRequest = config.url?.startsWith('/admin');
  const selectedAuth = isAdminRequest ? adminAuth : studentAuth;
  const auth = selectedAuth ? JSON.parse(selectedAuth) : null;

  if (auth?.token) {
    config.headers.Authorization = `Bearer ${auth.token}`;
  }

  return config;
});

export default api;
