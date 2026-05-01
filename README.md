# Turki Platform

Phase 1 is intended for local review and verification.

## Manual Review Checklist

- Public site routes: review `/`, `/projects`, `/cyber-labs`, `/skills`, `/contact`, and `/cv` on `http://localhost:5173`
- Admin login route: review `http://localhost:5174/security/login`
- SIEM event tests: confirm `login_failed`, `login_success`, `contact_form_submit`, and `cv_download` events are created during normal checks
- Sensitive path tests: request `/.env`, `/.git/config`, `/wp-admin`, `/phpmyadmin`, `/admin`, and `/config.php` on the backend and confirm `404` or `403` plus `sensitive_path_scan` events
- Logout test: sign in, use logout, and confirm protected admin routes return to an unauthenticated state
