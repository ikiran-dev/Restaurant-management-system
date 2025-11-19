export const APP_NAME = 'Digital Menu System';
export const APP_DESCRIPTION = 'Create and share restaurant menus with QR codes';

export const ROUTES = {
  HOME: '/',
  AUTH_LOGIN: '/auth/login',
  AUTH_REGISTER: '/auth/register',
  DASHBOARD: '/dashboard',
  DASHBOARD_RESTAURANTS: '/dashboard/restaurants',
  DASHBOARD_MENU: '/dashboard/menu',
};

export const API_ROUTES = {
  AUTH_REGISTER: '/api/auth/register',
  AUTH_LOGIN: '/api/auth/login',
  AUTH_LOGOUT: '/api/auth/logout',
  AUTH_ME: '/api/auth/me',
  RESTAURANTS: '/api/restaurants',
  CATEGORIES: '/api/categories',
  DISHES: '/api/dishes',
  MENUS: '/api/menus',
  PUBLIC_MENU: '/api/public/menu',
};

export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 8,
  SLUG_PATTERN: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
};
