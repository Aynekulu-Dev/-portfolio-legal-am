import { Global, Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { drizzle, PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

export const DB = "DB";
export type Database = PostgresJsDatabase<typeof schema>;

@Global()
@Module({
  providers: [
    {
      provide: DB,
      inject: [ConfigService],
      useFactory: (config: ConfigService): Database => {
        const connectionString = config.get<string>("DATABASE_URL");
        if (!connectionString) {
          throw new Error("DATABASE_URL is not set. Copy .env.example to .env and configure it.");
        }
        const client = postgres(connectionString, { max: 10 });
        return drizzle(client, { schema });
      }
    }
  ],
  exports: [DB]
})
export class DbModule {}
