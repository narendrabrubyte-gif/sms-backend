import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from './entities/course.entity';
import { CourseService } from './course.service';
import { CourseController } from './course.controller';
import { AuthModule } from 'src/auth/auth.module';

// ✅ IMPORT THESE
import { Mark } from 'src/marks/entities/mark.entity';
import { Enrollment } from 'src/enrollment/entities/enrollment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Course, Mark, Enrollment]), AuthModule],
  controllers: [CourseController],
  providers: [CourseService],
})
export class CourseModule {}
