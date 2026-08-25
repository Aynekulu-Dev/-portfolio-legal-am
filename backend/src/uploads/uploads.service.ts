import { BadRequestException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { randomUUID } from "node:crypto";

export type UploadKind = "avatar" | "resume";

@Injectable()
export class UploadsService {
  private readonly client: S3Client;
  private readonly bucket: string;
  private readonly publicUrl: string;

  constructor(private readonly config: ConfigService) {
    const accountId = this.config.get<string>("R2_ACCOUNT_ID");
    this.bucket = this.config.get<string>("R2_BUCKET_NAME", "portfolio");
    // Trim any trailing slash so `${publicUrl}/${key}` never double-slashes.
    this.publicUrl = (this.config.get<string>("R2_PUBLIC_URL") ?? "").replace(/\/$/, "");

    this.client = new S3Client({
      region: "auto",
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: this.config.get<string>("R2_ACCESS_KEY_ID") as string,
        secretAccessKey: this.config.get<string>("R2_SECRET_ACCESS_KEY") as string
      }
    });
  }

  async upload(file: Express.Multer.File | undefined, kind: UploadKind): Promise<{ url: string }> {
    if (!file) throw new BadRequestException("No file uploaded.");

    if (kind === "avatar" && !file.mimetype.startsWith("image/")) {
      throw new BadRequestException("Avatar must be an image file.");
    }
    if (kind === "resume" && file.mimetype !== "application/pdf") {
      throw new BadRequestException("Resume must be a PDF file.");
    }

    const maxBytes = kind === "avatar" ? 5 * 1024 * 1024 : 10 * 1024 * 1024;
    if (file.size > maxBytes) {
      throw new BadRequestException(`File too large (max ${maxBytes / (1024 * 1024)}MB).`);
    }

    const extension = file.originalname.includes(".") ? file.originalname.split(".").pop() : undefined;
    const key = `${kind}/${randomUUID()}${extension ? `.${extension}` : ""}`;

    await this.client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype
        // No ACL param: R2 buckets are made public via a custom domain / r2.dev
        // public access toggle in the Cloudflare dashboard, not per-object ACLs.
      })
    );

    return { url: `${this.publicUrl}/${key}` };
  }
}
