import { Inject, Injectable, InternalServerErrorException } from "@nestjs/common";
import type { UploadApiResponse, v2 as CloudinaryType } from "cloudinary";
import { CLOUDINARY } from "./cloudinary.provider";

@Injectable()
export class UploadsService {
  constructor(@Inject(CLOUDINARY) private readonly cloudinary: typeof CloudinaryType) {}

  async uploadBuffer(buffer: Buffer, folder: string): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const stream = this.cloudinary.uploader.upload_stream(
        {
          folder: `portfolio/${folder}`,
          resource_type: "auto" // auto-detects image vs. raw (e.g. PDF)
        },
        (error, result) => {
          if (error || !result) {
            return reject(new InternalServerErrorException(error?.message ?? "Upload failed."));
          }
          resolve(result);
        }
      );
      stream.end(buffer);
    });
  }
}
