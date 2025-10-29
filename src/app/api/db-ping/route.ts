import { NextResponse } from "next/server";
import { getPool } from "@/lib/db";

export async function GET() {
  try {
    const pool = await getPool();
    const result = await pool.request().query("SELECT 1 AS ok");
    return NextResponse.json({ db: "ok", result: result.recordset[0] }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ db: "fail", error: e?.message }, { status: 500 });
  }
}