"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const postgres_js_1 = require("drizzle-orm/postgres-js");
const migrator_1 = require("drizzle-orm/postgres-js/migrator");
const postgres_1 = __importDefault(require("postgres"));
async function main() {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString)
        throw new Error("DATABASE_URL is not set");
    const migrationClient = (0, postgres_1.default)(connectionString, { max: 1 });
    const db = (0, postgres_js_1.drizzle)(migrationClient);
    console.log("Running migrations...");
    await (0, migrator_1.migrate)(db, { migrationsFolder: "./drizzle" });
    console.log("Migrations complete.");
    await migrationClient.end();
}
main().catch((err) => {
    console.error(err);
    process.exit(1);
});
//# sourceMappingURL=migrate.js.map