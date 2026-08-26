import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from "@nestjs/common";
import { AdminGuard } from "../auth/admin.guard";
import { BlogService } from "./blog.service";
import { CreatePostDto, UpdatePostDto } from "./dto/post.dto";

@Controller("blog")
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Get()
  findAll() {
    return this.blogService.findAll();
  }

  // Admin inbox-style listing — includes drafts. Must be declared before
  // the ":slug" route below so Nest doesn't match "admin" as a slug.
  @Get("admin/all")
  @UseGuards(AdminGuard)
  findAllAdmin() {
    return this.blogService.findAllAdmin();
  }

  // Matches the frontend's /blog/[slug] route directly.
  @Get(":slug")
  findBySlug(@Param("slug") slug: string) {
    return this.blogService.findBySlug(slug);
  }

  @Post()
  @UseGuards(AdminGuard)
  create(@Body() dto: CreatePostDto) {
    return this.blogService.create(dto);
  }

  @Patch(":id")
  @UseGuards(AdminGuard)
  update(@Param("id", ParseIntPipe) id: number, @Body() dto: UpdatePostDto) {
    return this.blogService.update(id, dto);
  }

  @Delete(":id")
  @UseGuards(AdminGuard)
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.blogService.remove(id);
  }
}
