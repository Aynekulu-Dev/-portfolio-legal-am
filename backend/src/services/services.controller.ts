import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from "@nestjs/common";
import { AdminGuard } from "../auth/admin.guard";
import { ServicesService } from "./services.service";
import { CreateServiceDto, UpdateServiceDto } from "./dto/service.dto";

@Controller("services")
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Get()
  findAll() {
    return this.servicesService.findAll();
  }

  @Get(":id")
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.servicesService.findOne(id);
  }

  @Post()
  @UseGuards(AdminGuard)
  create(@Body() dto: CreateServiceDto) {
    return this.servicesService.create(dto);
  }

  @Patch(":id")
  @UseGuards(AdminGuard)
  update(@Param("id", ParseIntPipe) id: number, @Body() dto: UpdateServiceDto) {
    return this.servicesService.update(id, dto);
  }

  @Delete(":id")
  @UseGuards(AdminGuard)
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.servicesService.remove(id);
  }
}
