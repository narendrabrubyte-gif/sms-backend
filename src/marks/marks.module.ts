import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Mark } from './entities/mark.entity';
import { MarksService } from './marks.service';
import { MarksController } from './marks.controller';
import { AuthModule } from 'src/auth/auth.module';
import { Student } from 'src/student/entities/student.entity';
import { Course } from 'src/course/entities/course.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Mark, Student, Course]), AuthModule],
  controllers: [MarksController],
  providers: [MarksService],
})
export class MarksModule {}
