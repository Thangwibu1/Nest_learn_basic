import { CourseType } from '../types/course.type';
import { CourseResponseDto } from '../dtos/course-response.dto';

export class CourseMapper {
  static toResponse(type: CourseType): CourseResponseDto {
    return {
      id: type.id,
      name: type.name,
      createdAt: type.createdAt,
      updatedAt: type.updatedAt,
    };
  }
}
