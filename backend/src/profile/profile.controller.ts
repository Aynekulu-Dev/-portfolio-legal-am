import { Body, Controller, Get, Patch, UseGuards } from "@nestjs/common";
import { AdminGuard } from "../auth/admin.guard";
import { ProfileService } from "./profile.service";
import { UpdateProfileDto } from "./dto/update-profile.dto";

@Controller("profile")
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  get() {
    return this.profileService.get();
  }

  @Patch()
  @UseGuards(AdminGuard)
  update(@Body() dto: UpdateProfileDto) {
    return this.profileService.update(dto);
  }
}
