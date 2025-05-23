import Cookies from 'js-cookie';
import { API_ROUTES, STORAGE_KEYS } from './constants';

export function getUser() {
  const userStr = Cookies.get(STORAGE_KEYS.USER);
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
}

export function getToken() {
  return Cookies.get(STORAGE_KEYS.TOKEN);
}

export function logout() {
  Cookies.remove(STORAGE_KEYS.TOKEN);
  Cookies.remove(STORAGE_KEYS.USER);
}

export const isAuthenticated = () => {
  return !!getToken();
};

export const getAuthHeader = () => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}; 