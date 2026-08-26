import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { ConfigService } from "@nestjs/config";
import { ValidationPipe } from "@nestjs/common";
import helmet from "helmet";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  app.use(helmet());

  const configuredOrigins = config.get<string>("CORS_ORIGIN");
  const corsOrigins = configuredOrigins
    ?.split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

  if (!corsOrigins?.length) {
    throw new Error("CORS_ORIGIN must be configured with at least one allowed origin.");
  }

  app.enableCors({
    origin: corsOrigins,
    credentials: true,
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-CSRF-Protection"]
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true
    })
  );

  const port = config.get<number>("PORT", 4000);
  await app.listen(port);
  console.log(`Portfolio backend listening on port ${port}`);
}

bootstrap();
