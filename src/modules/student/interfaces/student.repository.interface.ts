import { CreateStudentDto } from '../dtos/create-student.dto';
import { UpdateStudentDto } from '../dtos/update-student.dto';
import { StudentType } from '../types/student.type';

export interface IStudentRepository {
  create(dto: CreateStudentDto): Promise<StudentType>;
  findById(id: number): Promise<StudentType | null>;
  update(id: number, dto: UpdateStudentDto): Promise<StudentType>;
}
