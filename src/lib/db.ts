// src/lib/db.ts
import sql from 'mssql';

const cfg: sql.config = {
  server: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 14333), // ← el puerto que abriste en Docker
  user: process.env.DB_USER || 'sa',
  password: process.env.DB_PASSWORD || 'Smart2052!',
  database: process.env.DB_NAME || 'BD_ARASAC',
  options: {
    encrypt: false,                 // SQL 2008: SIN TLS moderno
    trustServerCertificate: true,   // útil en desarrollo/on-prem
    enableArithAbort: true,
  },
  pool: { max: 10, min: 1, idleTimeoutMillis: 30000 },
};

let pool: sql.ConnectionPool | null = null;

export async function getPool() {
  if (pool && pool.connected) return pool;
  if (pool && pool.connecting) return pool;
  pool = new sql.ConnectionPool(cfg);
  await pool.connect();
  return pool;
}
