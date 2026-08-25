import { S3Client } from "@aws-sdk/client-s3";
import { ConfigService } from "@nestjs/config";

export const R2_CLIENT = "R2_CLIENT";

export const R2Provider = {
  provide: R2_CLIENT,
  inject: [ConfigService],
  useFactory: (config: ConfigService) => {
    const accountId = config.get<string>("R2_ACCOUNT_ID");

    return new S3Client({
      region: "auto",
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: config.get<string>("R2_ACCESS_KEY_ID") ?? "",
        secretAccessKey: config.get<string>("R2_SECRET_ACCESS_KEY") ?? ""
      }
    });
  }
};
