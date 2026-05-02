/**
 * Security configuration constants for Turki Platform.
 */

export const SENSITIVE_PATHS = [
  '/.env',
  '/.git/config',
  '/wp-admin',
  '/phpmyadmin',
  '/admin',
  '/config.php',
  '/xmlrpc.php',
  '/wp-login.php',
  '/backup',
  '/.htaccess',
];

export const SEVERITY_LEVELS = {
  INFO: 'info',
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical',
};

export const EVENT_TYPES = {
  LOGIN_SUCCESS: 'login_success',
  LOGIN_FAILED: 'login_failed',
  LOGOUT: 'logout',
  DASHBOARD_ACCESS_DENIED: 'dashboard_access_denied',
  CV_DOWNLOAD: 'cv_download',
  CONTACT_FORM_SUBMIT: 'contact_form_submit',
  SENSITIVE_PATH_SCAN: 'sensitive_path_scan',
  RATE_LIMIT_TRIGGERED: 'rate_limit_triggered',
  SERVER_ERROR: 'server_error',
  // Phase 2 — task operational events
  TASK_CREATED: 'task_created',
  TASK_UPDATED: 'task_updated',
  TASK_COMPLETED: 'task_completed',
  TASK_DELETED: 'task_deleted',
  // Phase 3 — application tracker events
  APPLICATION_CREATED: 'application_created',
  APPLICATION_UPDATED: 'application_updated',
  APPLICATION_STATUS_CHANGED: 'application_status_changed',
  APPLICATION_DELETED: 'application_deleted',
};

export const SESSION_DURATION = 8 * 60 * 60 * 1000; // 8 hours in milliseconds
