import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { IStudentRepository } from '../interfaces/student.repository.interface';
import { CreateStudentDto } from '../dtos/create-student.dto';
import { UpdateStudentDto } from '../dtos/update-student.dto';
import { StudentType } from '../types/student.type';

// TODO: thay bằng Entity thực tế của bạn
// import { StudentEntity } from '../../../infrastructure/database/entities/student.entity';

type RawEntity = any;

@Injectable()
export class StudentTypeOrmRepository implements IStudentRepository {
  constructor(
    // TODO: đổi Object thành Entity tương ứng.
    @InjectRepository(Object)
    private readonly ormRepo: Repository<RawEntity>,
  ) {}

  async create(dto: CreateStudentDto): Promise<StudentType> {
    const entity = this.ormRepo.create(dto as unknown as RawEntity);
    const saved = await this.ormRepo.save(entity);
    return saved as StudentType;
  }

  async findById(id: number): Promise<StudentType | null> {
    const found = await this.ormRepo.findOne({ where: { id } as any });
    return (found as StudentType) ?? null;
  }

  async update(id: number, dto: UpdateStudentDto): Promise<StudentType> {
    await this.ormRepo.update(id, dto as unknown as RawEntity);
    const updated = await this.ormRepo.findOne({ where: { id } as any });
    return updated as StudentType;
  }
}
