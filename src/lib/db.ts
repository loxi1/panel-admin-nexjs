// src/lib/db.ts
import sql, { ConnectionPool } from 'mssql';

let pool: ConnectionPool | null = null;

export async function getPool() {
  if (pool && pool.connected) return pool;

  const config: sql.config = {
    server: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT || '11433'), // 👈 puerto de docker compose
    user: process.env.DB_USER || 'sa',
    password: process.env.DB_PASSWORD || 'Smart2052!',
    database: process.env.DB_NAME || 'BD_ARASAC',
    options: {
      encrypt: false,           // en LAN/DEV normalmente false
      trustServerCertificate: true,
      enableArithAbort: true,
    },
    pool: {
      max: 10,
      min: 0,
      idleTimeoutMillis: 30000,
    },
  };

  pool = await sql.connect(config);
  return pool;
}
