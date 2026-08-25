import { Module } from "@nestjs/common";
import { UploadsController } from "./uploads.controller";
import { UploadsService } from "./uploads.service";

// No JwtModule import needed here: AuthModule is @Global() and already
// exports JwtAuthModule, which is what AdminGuard's JwtService resolves from.
@Module({
  controllers: [UploadsController],
  providers: [UploadsService]
})
export class UploadsModule {}
