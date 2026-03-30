import api from '../api/axios';

export const get = (url, config) => api.get(url, config);
export const post = (url, payload, config) => api.post(url, payload, config);
export const put = (url, payload, config) => api.put(url, payload, config);
export const del = (url, config) => api.delete(url, config);

export default api;
