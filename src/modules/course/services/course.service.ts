import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCourseDto } from '../dtos/create-course.dto';
import { UpdateCourseDto } from '../dtos/update-course.dto';
import { ICourseRepository } from '../interfaces/course.repository.interface';
import { COURSE_REPOSITORY } from '../course.module';

@Injectable()
export class CourseService {
  constructor(
    // DIP: Service phụ thuộc vào interface qua token, không phụ thuộc trực tiếp implementation.
    @Inject(COURSE_REPOSITORY)
    private readonly repository: ICourseRepository,
  ) {}

  async create(dto: CreateCourseDto) {
    return this.repository.create(dto);
  }

  async findOne(id: number) {
    const found = await this.repository.findById(id);
    if (!found) throw new NotFoundException('Course not found');
    return found;
  }

  async update(id: number, dto: UpdateCourseDto) {
    await this.findOne(id);
    return this.repository.update(id, dto);
  }
}
