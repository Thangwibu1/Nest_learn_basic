import { StudentType } from '../types/student.type';
import { StudentResponseDto } from '../dtos/student-response.dto';

export class StudentMapper {
  static toResponse(type: StudentType): StudentResponseDto {
    return {
      id: type.id,
      name: type.name,
      createdAt: type.createdAt,
      updatedAt: type.updatedAt,
    };
  }
}
