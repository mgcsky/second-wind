export const AUTH_MESSAGES = {
  EMAIL_PASSWORD_REQUIRED: 'Email and password are required',
  INVALID_CREDENTIALS: 'Invalid credentials',
  USER_EXISTS: 'User already exists',
  DEFAULT_ROLE_NOT_FOUND: 'Default role not found',
  INTERNAL_SERVER_ERROR: 'Internal server error',
  AUTHENTICATION_REQUIRED: 'Authentication required',
  INVALID_TOKEN: 'Invalid token',
  LOGIN_FAILED: 'Login failed',
} as const;

export const API_MESSAGES = {
  NOT_FOUND: 'Resource not found',
  CREATED: 'Resource created successfully',
  UPDATED: 'Resource updated successfully',
  DELETED: 'Resource deleted successfully',
  VALIDATION_ERROR: 'Validation error',
  UNAUTHORIZED: 'Unauthorized access',
  FORBIDDEN: 'Forbidden access',
  INVALID_REQUEST: 'Invalid request',
  DUPLICATE_ENTRY: 'Duplicate entry',
} as const;

export const API_ROUTES = {
  // Auth routes
  LOGIN: '/api/auth/login',
  REGISTER: '/api/auth/register',
  DASHBOARD: '/dashboard',
  
  // User routes
  USERS: '/api/users',
  USER_BY_ID: (id: string) => `/api/users/${id}`,
  
  // Customer routes
  CUSTOMERS: '/api/customers',
  CUSTOMER_BY_ID: (id: string) => `/api/customers/${id}`,
  
  // Order routes
  ORDERS: '/api/orders',
  ORDER_BY_ID: (id: string) => `/api/orders/${id}`,
  
  // Item routes
  ITEMS: '/api/items',
  ITEM_BY_ID: (id: string) => `/api/items/${id}`,
  
  // Category routes
  CATEGORIES: '/api/categories',
  CATEGORY_BY_ID: (id: string) => `/api/categories/${id}`,
  
  // Role routes
  ROLES: '/api/roles',
  ROLE_BY_ID: (id: string) => `/api/roles/${id}`,
  
  // Permission routes
  PERMISSIONS: '/api/permissions',
  PERMISSION_BY_ID: (id: string) => `/api/permissions/${id}`,
} as const;

export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
} as const;

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const; 