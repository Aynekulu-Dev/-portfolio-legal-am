import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";
import { APP_GUARD } from "@nestjs/core";
import { DbModule } from "./db/db.module";
import { AuthModule } from "./auth/auth.module";
import { ProfileModule } from "./profile/profile.module";
import { ServicesModule } from "./services/services.module";
import { ProjectsModule } from "./projects/projects.module";
import { BlogModule } from "./blog/blog.module";
import { ContactModule } from "./contact/contact.module";
import { UploadsModule } from "./uploads/uploads.module";
import { TestimonialsModule } from "./testimonials/testimonials.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    // NFR-04: global IP-based rate limiting baseline for all routes.
    // /contact applies a stricter override (see contact.controller.ts).
    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        throttlers: [
          {
            ttl: Number(config.get("THROTTLE_TTL", 60)) * 1000,
            limit: Number(config.get("THROTTLE_LIMIT", 30))
          }
        ]
      })
    }),
    DbModule,
    AuthModule,
    ProfileModule,
    ServicesModule,
    ProjectsModule,
    BlogModule,
    ContactModule,
    UploadsModule,
    TestimonialsModule
  ],
  controllers: [AppController],
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }]
})
export class AppModule {}