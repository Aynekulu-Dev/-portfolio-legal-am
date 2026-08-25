"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const serverless_1 = require("@neondatabase/serverless");
const neon_http_1 = require("drizzle-orm/neon-http");
const migrator_1 = require("drizzle-orm/neon-http/migrator");
async function main() {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString)
        throw new Error("DATABASE_URL is not set");
    const sql = (0, serverless_1.neon)(connectionString);
    const db = (0, neon_http_1.drizzle)(sql);
    console.log("Running migrations over HTTPS (port 443)...");
    await (0, migrator_1.migrate)(db, { migrationsFolder: "./drizzle" });
    console.log("Migrations complete.");
}
main().catch((err) => {
    console.error(err);
    process.exit(1);
});
//# sourceMappingURL=migrate-http.js.map