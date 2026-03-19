import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { CourseService } from '../services/course.service';
import { CreateCourseDto } from '../dtos/create-course.dto';
import { UpdateCourseDto } from '../dtos/update-course.dto';

@Controller('course')
export class CourseController {
  constructor(private readonly service: CourseService) {}

  @Post()
  create(@Body() dto: CreateCourseDto) {
    // Controller chỉ nhận request và gọi service.
    return this.service.create(dto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(Number(id));
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateCourseDto) {
    return this.service.update(Number(id), dto);
  }
}
