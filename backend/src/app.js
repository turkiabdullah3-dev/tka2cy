import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import session from 'express-session';
import connectPgSimple from 'connect-pg-simple';
import pool from './database/db.js';
import { SESSION_DURATION } from './security/security.config.js';
import { detectSensitivePath } from './middleware/sensitive-path.middleware.js';
import { siemRequestLogger } from './middleware/siem-logger.middleware.js';
import { apiRateLimit } from './middleware/rate-limit.middleware.js';
import { errorHandler } from './middleware/error.middleware.js';

// Route modules
import authRoutes from './modules/auth/auth.routes.js';
import siemRoutes from './modules/siem/siem.routes.js';
import publicRoutes from './modules/public/public.routes.js';
import contactRoutes from './modules/contact/contact.routes.js';
import analyticsRoutes from './modules/analytics/analytics.routes.js';
import tasksRoutes from './modules/tasks/tasks.routes.js';
import applicationsRoutes from './modules/applications/applications.routes.js';
import jobIntelligenceRoutes from './modules/job-intelligence/jobIntelligence.routes.js';

const app = express();
const NODE_ENV = process.env.NODE_ENV || 'development';
const isProduction = NODE_ENV === 'production';

// ────────────────────────────────────────────────────────────
// Security headers via helmet
// ────────────────────────────────────────────────────────────
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:', 'https:'],
        connectSrc: ["'self'"],
        fontSrc: ["'self'"],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        frameSrc: ["'none'"],
        baseUri: ["'self'"],
        formAction: ["'self'"],
        frameAncestors: ["'none'"],
        upgradeInsecureRequests: isProduction ? [] : null,
      },
    },
    crossOriginEmbedderPolicy: false,
    hsts: isProduction
      ? { maxAge: 31536000, includeSubDomains: true, preload: true }
      : false,
  })
);

// Remove X-Powered-By header (helmet does this by default, being explicit)
app.disable('x-powered-by');

// ────────────────────────────────────────────────────────────
// CORS
// ────────────────────────────────────────────────────────────
const allowedOrigins = (process.env.ALLOWED_ORIGINS || '')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. server-to-server, curl)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      callback(new Error(`CORS: Origin '${origin}' not allowed`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// ────────────────────────────────────────────────────────────
// HTTP request logging (development only)
// ────────────────────────────────────────────────────────────
if (NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// ────────────────────────────────────────────────────────────
// Body parsers
// ────────────────────────────────────────────────────────────
app.use(express.json({ limit: '50kb' }));
app.use(express.urlencoded({ extended: true }));

// ────────────────────────────────────────────────────────────
// Session store
// ────────────────────────────────────────────────────────────
const PgSession = connectPgSimple(session);

app.use(
  session({
    store: new PgSession({
      pool,
      createTableIfMissing: true, // Auto-create session table if needed
      tableName: 'session',
    }),
    name: 'turki.sid', // Obscure the framework fingerprint
    secret: process.env.SESSION_SECRET || 'fallback-dev-secret-change-in-production',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: 'strict',
      secure: isProduction,
      maxAge: SESSION_DURATION, // 8 hours
    },
  })
);

// ────────────────────────────────────────────────────────────
// Sensitive path detection (runs on every request before routes)
// ────────────────────────────────────────────────────────────
app.use(detectSensitivePath);

// ────────────────────────────────────────────────────────────
// SIEM request logger (fire-and-forget, never blocks)
// ────────────────────────────────────────────────────────────
app.use(siemRequestLogger);

// ────────────────────────────────────────────────────────────
// General API rate limiter (applied to all /api/* routes)
// ────────────────────────────────────────────────────────────
app.use('/api', apiRateLimit);

// ────────────────────────────────────────────────────────────
// Route modules
// ────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/siem', siemRoutes);
app.use('/api/public', publicRoutes);

// Contact is mounted at both /api/public/contact and /api/contact
app.use('/api/public/contact', contactRoutes);
app.use('/api/contact', contactRoutes);

// Phase 2 modules
app.use('/api/analytics', analyticsRoutes);
app.use('/api/tasks', tasksRoutes);

// Phase 3 modules
app.use('/api/applications', applicationsRoutes);

// Phase 4 modules
app.use('/api/job-intelligence', jobIntelligenceRoutes);

// ────────────────────────────────────────────────────────────
// Health check (no auth, no rate limit)
// ────────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    env: NODE_ENV,
  });
});

// ────────────────────────────────────────────────────────────
// 404 handler for unmatched routes
// ────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// ────────────────────────────────────────────────────────────
// Global error handler (must be last)
// ────────────────────────────────────────────────────────────
app.use(errorHandler);

export default app;
