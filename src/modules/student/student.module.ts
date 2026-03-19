import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentController } from './controllers/student.controller';
import { StudentService } from './services/student.service';
import { StudentTypeOrmRepository } from './repositories/student.typeorm.repository';

// TODO: Đổi sang token constant chung trong common/constants nếu bạn đã có sẵn.
export const STUDENT_REPOSITORY = 'STUDENT_REPOSITORY';

@Module({
  imports: [
    // TODO: thay bằng Entity thực tế của bạn.
    TypeOrmModule.forFeature([]),
  ],
  controllers: [StudentController],
  providers: [
    StudentService,
    {
      provide: STUDENT_REPOSITORY,
      useClass: StudentTypeOrmRepository,
    },
  ],
  exports: [StudentService],
})
export class StudentModule {}
