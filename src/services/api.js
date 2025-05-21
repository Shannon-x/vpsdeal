import axios from 'axios';

const API_BASE_URL = process.env.VUE_APP_API_BASE_URL || '/api';

// 管理员登录
export function login(username, password) {
  return axios.post(`${API_BASE_URL}/login`, { username, password });
}

// 获取所有分类的 VPS 数据
export function getVpsData() {
  return axios.get(`${API_BASE_URL}/vps`);
}

// 获取指定分类的 VPS 列表
export function getCategory(category) {
  return axios.get(`${API_BASE_URL}/vps/${category}`);
}

// 添加 VPS
export function addVps(category, vps, token) {
  return axios.post(`${API_BASE_URL}/vps/${category}`, vps, {
    headers: { Authorization: `Bearer ${token}` }
  });
}

// 编辑 VPS
export function updateVps(category, index, vps, token) {
  return axios.put(`${API_BASE_URL}/vps/${category}/${index}`, vps, {
    headers: { Authorization: `Bearer ${token}` }
  });
}

// 删除 VPS
export function deleteVps(category, index, token) {
  return axios.delete(`${API_BASE_URL}/vps/${category}/${index}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
} 