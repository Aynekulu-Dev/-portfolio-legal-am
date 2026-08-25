import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { ConfigService } from "@nestjs/config";
import { ValidationPipe } from "@nestjs/common";
import helmet from "helmet";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  // NFR-06: enforce sane security headers; put this behind HTTPS/TLS at the
  // reverse-proxy / hosting layer (Vercel, Railway, Render, etc. do this by default).
  app.use(helmet());

  const corsOrigin = config.get<string>("CORS_ORIGIN", "*");
  app.enableCors({
    origin: corsOrigin === "*" ? true : corsOrigin.split(",").map((o) => o.trim()),
    methods: ["GET", "POST", "PATCH", "DELETE"]
  });

  // NFR-05: strict validation + sanitization of all incoming payloads.
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // strip unknown properties
      forbidNonWhitelisted: true, // reject requests containing unknown properties
      transform: true // coerce payloads to DTO types (e.g. numeric path params)
    })
  );

  // No global prefix: routes are exposed at the root (e.g. /contact, /profile)
  // so the frontend's NEXT_PUBLIC_API_URL can point straight at this server's
  // origin, matching ContactForm.tsx's fetch(`${API_URL}/contact`) as-is.

  const port = config.get<number>("PORT", 4000);
  await app.listen(port);
  console.log(`Portfolio backend listening on http://localhost:${port}`);
}

bootstrap();
