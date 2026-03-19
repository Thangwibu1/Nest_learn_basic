import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { StudentService } from '../services/student.service';
import { CreateStudentDto } from '../dtos/create-student.dto';
import { UpdateStudentDto } from '../dtos/update-student.dto';

@Controller('student')
export class StudentController {
  constructor(private readonly service: StudentService) {}

  @Post()
  create(@Body() dto: CreateStudentDto) {
    // Controller chỉ nhận request và gọi service.
    return this.service.create(dto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(Number(id));
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateStudentDto) {
    return this.service.update(Number(id), dto);
  }
}
