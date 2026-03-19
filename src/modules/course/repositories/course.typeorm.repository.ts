import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ICourseRepository } from '../interfaces/course.repository.interface';
import { CreateCourseDto } from '../dtos/create-course.dto';
import { UpdateCourseDto } from '../dtos/update-course.dto';
import { CourseType } from '../types/course.type';

// TODO: thay bằng Entity thực tế của bạn
// import { CourseEntity } from '../../../infrastructure/database/entities/course.entity';

type RawEntity = any;

@Injectable()
export class CourseTypeOrmRepository implements ICourseRepository {
  constructor(
    // TODO: đổi Object thành Entity tương ứng.
    @InjectRepository(Object)
    private readonly ormRepo: Repository<RawEntity>,
  ) {}

  async create(dto: CreateCourseDto): Promise<CourseType> {
    const entity = this.ormRepo.create(dto as unknown as RawEntity);
    const saved = await this.ormRepo.save(entity);
    return saved as CourseType;
  }

  async findById(id: number): Promise<CourseType | null> {
    const found = await this.ormRepo.findOne({ where: { id } as any });
    return (found as CourseType) ?? null;
  }

  async update(id: number, dto: UpdateCourseDto): Promise<CourseType> {
    await this.ormRepo.update(id, dto as unknown as RawEntity);
    const updated = await this.ormRepo.findOne({ where: { id } as any });
    return updated as CourseType;
  }
}
