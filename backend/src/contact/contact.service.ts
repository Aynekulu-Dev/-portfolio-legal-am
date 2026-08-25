import { Inject, Injectable } from "@nestjs/common";
import { desc, eq } from "drizzle-orm";
import { DB, Database } from "../db/db.module";
import { contactMessages } from "../db/schema";
import { CreateContactDto } from "./dto/create-contact.dto";
import { MailService } from "./mail.service";

@Injectable()
export class ContactService {
  constructor(
    @Inject(DB) private readonly db: Database,
    private readonly mailService: MailService
  ) {}

  async create(dto: CreateContactDto) {
    const [saved] = await this.db
      .insert(contactMessages)
      .values({
        senderName: dto.sender_name,
        senderEmail: dto.sender_email,
        message: dto.message
      })
      .returning();

    // Fire-and-forget-ish: email failures are logged, not thrown, so the
    // visitor still gets a success response once their message is saved.
    void this.mailService.sendContactNotification({
      senderName: dto.sender_name,
      senderEmail: dto.sender_email,
      message: dto.message
    });

    return { received: true, id: saved.id };
  }

  // Admin-only inbox endpoints
  findAll() {
    return this.db.select().from(contactMessages).orderBy(desc(contactMessages.createdAt));
  }

  async markRead(id: number) {
    const [updated] = await this.db
      .update(contactMessages)
      .set({ isRead: true })
      .where(eq(contactMessages.id, id))
      .returning();
    return updated;
  }
}
