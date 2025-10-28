// src/lib/db.ts (ejemplo usando mssql)
import sql from "mssql";

const config: sql.config = {
  server: process.env.DB_SERVER as string,            // <-- sin '|| 127.0.0.1'
  port: Number(process.env.DB_PORT || 1433),
  database: process.env.DB_NAME as string,
  user: process.env.DB_USER as string,
  password: process.env.DB_PASSWORD as string,
  options: {
    encrypt: String(process.env.DB_ENCRYPT).toLowerCase() === "true",
    trustServerCertificate: String(process.env.DB_TRUST_SERVER_CERT).toLowerCase() === "true",
    enableArithAbort: true,
  },
  requestTimeout: 30000,
  connectionTimeout: 15000,
  pool: { max: 10, min: 0, idleTimeoutMillis: 30000 },
};

let pool: sql.ConnectionPool | null = null;

export async function getPool() {
  if (!pool) {
    console.log("[DB] Conectando a", process.env.DB_SERVER, ":", process.env.DB_PORT);
    pool = await sql.connect(config);
  }
  return pool;
}
