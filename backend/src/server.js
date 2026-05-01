import 'dotenv/config';
import app from './app.js';

const PORT = process.env.PORT || 3001;
const NODE_ENV = process.env.NODE_ENV || 'development';

const server = app.listen(PORT, () => {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`  Turki Platform Backend`);
  console.log(`  PORT     : ${PORT}`);
  console.log(`  NODE_ENV : ${NODE_ENV}`);
  console.log(`  Started  : ${new Date().toISOString()}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`[SERVER] Port ${PORT} is already in use.`);
  } else {
    console.error('[SERVER] Fatal error:', err.message);
  }
  process.exit(1);
});

process.on('SIGTERM', () => {
  console.log('[SERVER] SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('[SERVER] HTTP server closed.');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('[SERVER] SIGINT received. Shutting down gracefully...');
  server.close(() => {
    console.log('[SERVER] HTTP server closed.');
    process.exit(0);
  });
});
