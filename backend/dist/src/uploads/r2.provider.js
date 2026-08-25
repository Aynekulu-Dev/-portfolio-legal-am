"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.R2Provider = exports.R2_CLIENT = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const config_1 = require("@nestjs/config");
exports.R2_CLIENT = "R2_CLIENT";
exports.R2Provider = {
    provide: exports.R2_CLIENT,
    inject: [config_1.ConfigService],
    useFactory: (config) => {
        const accountId = config.get("R2_ACCOUNT_ID");
        return new client_s3_1.S3Client({
            region: "auto",
            endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
            credentials: {
                accessKeyId: config.get("R2_ACCESS_KEY_ID") ?? "",
                secretAccessKey: config.get("R2_SECRET_ACCESS_KEY") ?? ""
            }
        });
    }
};
//# sourceMappingURL=r2.provider.js.map