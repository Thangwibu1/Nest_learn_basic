import { CreateCourseDto } from '../dtos/create-course.dto';
import { UpdateCourseDto } from '../dtos/update-course.dto';
import { CourseType } from '../types/course.type';

export interface ICourseRepository {
  create(dto: CreateCourseDto): Promise<CourseType>;
  findById(id: number): Promise<CourseType | null>;
  update(id: number, dto: UpdateCourseDto): Promise<CourseType>;
}
