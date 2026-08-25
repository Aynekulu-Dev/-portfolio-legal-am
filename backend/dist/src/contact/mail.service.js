"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var MailService_1;
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const nodemailer = __importStar(require("nodemailer"));
let MailService = MailService_1 = class MailService {
    constructor(config) {
        this.config = config;
        this.logger = new common_1.Logger(MailService_1.name);
        this.transporter = null;
        const host = this.config.get("SMTP_HOST");
        if (host) {
            this.transporter = nodemailer.createTransport({
                host,
                port: Number(this.config.get("SMTP_PORT") ?? 587),
                secure: this.config.get("SMTP_SECURE") === "true",
                auth: {
                    user: this.config.get("SMTP_USER"),
                    pass: this.config.get("SMTP_PASS")
                }
            });
        }
    }
    async sendContactNotification(notification) {
        const to = this.config.get("MAIL_TO");
        const from = this.config.get("MAIL_FROM") ?? "no-reply@localhost";
        if (!to) {
            this.logger.warn("MAIL_TO is not configured — skipping email dispatch (message was still saved to the DB).");
            return;
        }
        const subject = `New portfolio contact message from ${notification.senderName}`;
        const text = `From: ${notification.senderName} <${notification.senderEmail}>\n\n${notification.message}`;
        const html = `<p><strong>From:</strong> ${escapeHtml(notification.senderName)} &lt;${escapeHtml(notification.senderEmail)}&gt;</p><p>${escapeHtml(notification.message).replace(/\n/g, "<br/>")}</p>`;
        const resendKey = this.config.get("RESEND_API_KEY");
        try {
            if (resendKey) {
                await this.sendViaResend(resendKey, { to, from, subject, text, html, replyTo: notification.senderEmail });
            }
            else if (this.transporter) {
                await this.transporter.sendMail({ to, from, subject, text, html, replyTo: notification.senderEmail });
            }
            else {
                this.logger.warn("No SMTP or Resend credentials configured — skipping email dispatch.");
            }
        }
        catch (err) {
            this.logger.error("Failed to send contact notification email", err);
        }
    }
    async sendViaResend(apiKey, args) {
        const res = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${apiKey}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                from: args.from,
                to: [args.to],
                subject: args.subject,
                text: args.text,
                html: args.html,
                reply_to: args.replyTo
            })
        });
        if (!res.ok) {
            throw new Error(`Resend API responded ${res.status}: ${await res.text()}`);
        }
    }
};
exports.MailService = MailService;
exports.MailService = MailService = MailService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _a : Object])
], MailService);
function escapeHtml(input) {
    return input
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}
//# sourceMappingURL=mail.service.js.map