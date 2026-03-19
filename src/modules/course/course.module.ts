import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourseController } from './controllers/course.controller';
import { CourseService } from './services/course.service';
import { CourseTypeOrmRepository } from './repositories/course.typeorm.repository';

// TODO: Đổi sang token constant chung trong common/constants nếu bạn đã có sẵn.
export const COURSE_REPOSITORY = 'COURSE_REPOSITORY';

@Module({
  imports: [
    // TODO: thay bằng Entity thực tế của bạn.
    TypeOrmModule.forFeature([]),
  ],
  controllers: [CourseController],
  providers: [
    CourseService,
    {
      provide: COURSE_REPOSITORY,
      useClass: CourseTypeOrmRepository,
    },
  ],
  exports: [CourseService],
})
export class CourseModule {}
