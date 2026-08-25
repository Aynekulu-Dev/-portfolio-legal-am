// Alternative to migrate.ts for networks that block outbound TCP port 5432
// (some ISPs block raw Postgres connections). This uses Neon's HTTP driver,
// which talks to Neon over standard HTTPS (443) instead of a raw TCP socket,
// so it works even when db:migrate does not.
//
// Usage: npm run db:migrate:http
//
// This is a LOCAL WORKAROUND ONLY — it requires DATABASE_URL to point at a
// Neon database (it will not work with other Postgres providers). The app
// itself (db.module.ts) is unchanged and keeps using the regular driver,
// since Render's servers can already reach Neon on port 5432 fine.
import "dotenv/config";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { migrate } from "drizzle-orm/neon-http/migrator";

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error("DATABASE_URL is not set");

  const sql = neon(connectionString);
  const db = drizzle(sql);

  console.log("Running migrations over HTTPS (port 443)...");
  await migrate(db, { migrationsFolder: "./drizzle" });
  console.log("Migrations complete.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
