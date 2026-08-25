import { Controller, Post, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { AdminGuard } from "../auth/admin.guard";
import { UploadsService } from "./uploads.service";

/**
 * Admin-only file uploads (avatar image + resume PDF), proxied to Cloudinary.
 * Matches the frontend's adminUploadFile("/uploads/avatar" | "/uploads/resume").
 */
@Controller("uploads")
@UseGuards(AdminGuard)
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Post("avatar")
  @UseInterceptors(FileInterceptor("file"))
  uploadAvatar(@UploadedFile() file: Express.Multer.File) {
    return this.uploadsService.upload(file, "avatar");
  }

  @Post("resume")
  @UseInterceptors(FileInterceptor("file"))
  uploadResume(@UploadedFile() file: Express.Multer.File) {
    return this.uploadsService.upload(file, "resume");
  }
}
