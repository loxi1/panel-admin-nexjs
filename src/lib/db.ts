// src/lib/db.ts
import sql, { ConnectionPool } from 'mssql';

let pool: ConnectionPool | null = null;

export async function getPool() {
  if (pool) return pool;

  pool = await new sql.ConnectionPool({
    server: process.env.MSSQL_HOST!,
    port: Number(process.env.MSSQL_PORT || 1433),
    user: process.env.MSSQL_USER!,
    password: process.env.MSSQL_PASS!,
    database: process.env.MSSQL_DB!,
    options: {
      encrypt: false,       // en dev container no hace falta
      trustServerCertificate: true
    }
  }).connect();

  pool.on('error', (err) => {
    console.error('MSSQL pool error', err);
    pool = null;
  });

  return pool;
}
