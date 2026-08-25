import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as nodemailer from "nodemailer";

interface ContactNotification {
  senderName: string;
  senderEmail: string;
  message: string;
}

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: nodemailer.Transporter | null = null;

  constructor(private readonly config: ConfigService) {
    const host = this.config.get<string>("SMTP_HOST");
    if (host) {
      this.transporter = nodemailer.createTransport({
        host,
        port: Number(this.config.get<string>("SMTP_PORT") ?? 587),
        secure: this.config.get<string>("SMTP_SECURE") === "true",
        auth: {
          user: this.config.get<string>("SMTP_USER"),
          pass: this.config.get<string>("SMTP_PASS")
        }
      });
    }
  }

  async sendContactNotification(notification: ContactNotification): Promise<void> {
    const to = this.config.get<string>("MAIL_TO");
    const from = this.config.get<string>("MAIL_FROM") ?? "no-reply@localhost";

    if (!to) {
      this.logger.warn("MAIL_TO is not configured — skipping email dispatch (message was still saved to the DB).");
      return;
    }

    const subject = `New portfolio contact message from ${notification.senderName}`;
    const text = `From: ${notification.senderName} <${notification.senderEmail}>\n\n${notification.message}`;
    const html = `<p><strong>From:</strong> ${escapeHtml(notification.senderName)} &lt;${escapeHtml(
      notification.senderEmail
    )}&gt;</p><p>${escapeHtml(notification.message).replace(/\n/g, "<br/>")}</p>`;

    const resendKey = this.config.get<string>("RESEND_API_KEY");

    try {
      if (resendKey) {
        await this.sendViaResend(resendKey, { to, from, subject, text, html, replyTo: notification.senderEmail });
      } else if (this.transporter) {
        await this.transporter.sendMail({ to, from, subject, text, html, replyTo: notification.senderEmail });
      } else {
        this.logger.warn("No SMTP or Resend credentials configured — skipping email dispatch.");
      }
    } catch (err) {
      // Never let a downstream email failure surface as a 500 to the visitor —
      // the message is already safely persisted in contact_messages.
      this.logger.error("Failed to send contact notification email", err as Error);
    }
  }

  private async sendViaResend(
    apiKey: string,
    args: { to: string; from: string; subject: string; text: string; html: string; replyTo: string }
  ) {
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
}

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
