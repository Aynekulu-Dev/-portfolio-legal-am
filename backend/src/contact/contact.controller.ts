import { Body, Controller, Get, HttpCode, Param, ParseIntPipe, Patch, Post, UseGuards } from "@nestjs/common";
import { Throttle } from "@nestjs/throttler";
import { AdminGuard } from "../auth/admin.guard";
import { ContactService } from "./contact.service";
import { CreateContactDto } from "./dto/create-contact.dto";

@Controller("contact")
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  // NFR-04: IP-based rate limiting on top of the global default (see app.module.ts),
  // tightened further here since this is the most spam-prone public endpoint.
  @Post()
  @HttpCode(200)
  @Throttle({ default: { limit: 3, ttl: 60_000 } })
  create(@Body() dto: CreateContactDto) {
    return this.contactService.create(dto);
  }

  // Admin inbox — list and mark-as-read
  @Get()
  @UseGuards(AdminGuard)
  findAll() {
    return this.contactService.findAll();
  }

  @Patch(":id/read")
  @UseGuards(AdminGuard)
  markRead(@Param("id", ParseIntPipe) id: number) {
    return this.contactService.markRead(id);
  }
}
