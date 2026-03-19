import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateStudentDto } from '../dtos/create-student.dto';
import { UpdateStudentDto } from '../dtos/update-student.dto';
import { IStudentRepository } from '../interfaces/student.repository.interface';
import { STUDENT_REPOSITORY } from '../student.module';

@Injectable()
export class StudentService {
  constructor(
    // DIP: Service phụ thuộc vào interface qua token, không phụ thuộc trực tiếp implementation.
    @Inject(STUDENT_REPOSITORY)
    private readonly repository: IStudentRepository,
  ) {}

  async create(dto: CreateStudentDto) {
    return this.repository.create(dto);
  }

  async findOne(id: number) {
    const found = await this.repository.findById(id);
    if (!found) throw new NotFoundException('Student not found');
    return found;
  }

  async update(id: number, dto: UpdateStudentDto) {
    await this.findOne(id);
    return this.repository.update(id, dto);
  }
}
