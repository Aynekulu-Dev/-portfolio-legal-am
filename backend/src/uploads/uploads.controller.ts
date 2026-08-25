import {
  BadRequestException,
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import type { Express } from "express";
import { AdminGuard } from "../auth/admin.guard";
import { UploadsService } from "./uploads.service";

const MAX_FILE_SIZE = 8 * 1024 * 1024;
const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const PDF_TYPE = "application/pdf";

@Controller("uploads")
@UseGuards(AdminGuard)
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Post("avatar")
  @UseInterceptors(FileInterceptor("file", { limits: { fileSize: MAX_FILE_SIZE } }))
  async uploadAvatar(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException("No file uploaded.");
    if (!IMAGE_TYPES.includes(file.mimetype)) {
      throw new BadRequestException("Avatar must be a JPEG, PNG, WebP, or GIF image.");
    }
    const result = await this.uploadsService.uploadBuffer(
      file.buffer,
      "avatars",
      file.mimetype,
      file.originalname
    );
    return { url: result.url };
  }

  @Post("resume")
  @UseInterceptors(FileInterceptor("file", { limits: { fileSize: MAX_FILE_SIZE } }))
  async uploadResume(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException("No file uploaded.");
    if (file.mimetype !== PDF_TYPE) {
      throw new BadRequestException("Resume must be a PDF file.");
    }
    const result = await this.uploadsService.uploadBuffer(
      file.buffer,
      "resumes",
      file.mimetype,
      file.originalname
    );
    return { url: result.url };
  }
}
