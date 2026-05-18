// main.ts
//
// The entry point of the entire API.
// This is the first file that runs when the server starts.
// Everything configured here applies GLOBALLY to every single
// request that comes into the API — no exceptions.

import { Logger, ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app/app.module";
import helmet from "helmet";
import cookieParser from "cookie-parser";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ── Security Headers ──────────────────────────────────────────
  // helmet sets HTTP security headers on every response.
  // Prevents clickjacking, XSS, MIME sniffing and more.
  app.use(helmet());

  // ── Cookie Parser ─────────────────────────────────────────────
  // Allows NestJS to read cookies from incoming requests.
  // Required for reading the httpOnly refresh token cookie
  // on POST /auth/refresh and POST /auth/logout.
  app.use(cookieParser());

  // ── CORS ──────────────────────────────────────────────────────
  // Cross-Origin Resource Sharing.
  // Without this, the browser blocks requests from the portal
  // (localhost:3000) to the API (localhost:3001).
  // credentials: true is required to allow cookies to be sent
  // (the refresh token is a cookie — it won't be sent without this).
  app.enableCors({
    origin: process.env.PORTAL_URL || "http://localhost:3000",
    credentials: true, // CRITICAL — allows cookies to be sent cross-origin
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  });

  // ── Global Prefix ─────────────────────────────────────────────
  // Every route in the API is prefixed with /api.
  // POST /auth/login becomes POST /api/auth/login.
  // This makes it easy to route traffic in production:
  //   /api/* → NestJS API
  //   /*     → Next.js portal
  app.setGlobalPrefix("api");

  // ── Global Validation Pipe ────────────────────────────────────
  // Automatically validates every request body against its DTO.
  // If validation fails → HTTP 400 before the handler even runs.
  //
  // whitelist: true
  //   Strips any properties not defined in the DTO.
  //   If a request sends { email, password, isAdmin: true }
  //   and the DTO only has email and password →
  //   isAdmin is silently removed before reaching the service.
  //   Prevents extra fields from polluting the data.
  //
  // forbidNonWhitelisted: true
  //   Instead of silently stripping unknown fields →
  //   reject the request with 400 if unknown fields are present.
  //   More secure than whitelist alone.
  //
  // transform: true
  //   Automatically converts incoming data to the correct type.
  //   If the DTO says a field is a number but it arrives as
  //   the string "42" → transforms it to the number 42.
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const port = process.env.PORT || 3001;
  await app.listen(port);

  Logger.log(`🚀 API running on: http://localhost:${port}/api`, "Bootstrap");
}

bootstrap();
