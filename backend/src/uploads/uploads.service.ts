import { Inject, Injectable, InternalServerErrorException } from "@nestjs/common";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { ConfigService } from "@nestjs/config";
import { randomUUID } from "crypto";
import { R2_CLIENT } from "./r2.provider";

@Injectable()
export class UploadsService {
  constructor(
    @Inject(R2_CLIENT) private readonly r2: S3Client,
    private readonly config: ConfigService
  ) {}

  async uploadBuffer(
    buffer: Buffer,
    folder: string,
    mimetype: string,
    originalName?: string
  ): Promise<{ url: string; key: string }> {
    const bucket = this.config.get<string>("R2_BUCKET_NAME");
    const publicUrl = this.config.get<string>("R2_PUBLIC_URL");

    const extension = originalName?.includes(".")
      ? originalName.split(".").pop()
      : mimetype.split("/").pop();
    const key = `${folder}/${randomUUID()}.${extension}`;

    try {
      await this.r2.send(
        new PutObjectCommand({
          Bucket: bucket,
          Key: key,
          Body: buffer,
          ContentType: mimetype
        })
      );
    } catch (error) {
      throw new InternalServerErrorException(
        error instanceof Error ? error.message : "Upload failed."
      );
    }

    return { url: `${publicUrl}/${key}`, key };
  }
}
