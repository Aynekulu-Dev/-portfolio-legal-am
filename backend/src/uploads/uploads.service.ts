import { Inject, Injectable, InternalServerErrorException } from "@nestjs/common";
import * as CloudinaryNS from "cloudinary";
import type { UploadApiResponse } from "cloudinary";
import { CLOUDINARY } from "./cloudinary.provider";

@Injectable()
export class UploadsService {
  constructor(@Inject(CLOUDINARY) private readonly cloudinary: typeof CloudinaryNS.v2) {}

  async uploadBuffer(buffer: Buffer, folder: string): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const stream = this.cloudinary.uploader.upload_stream(
        { folder: `portfolio/${folder}`, resource_type: "auto" },
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
