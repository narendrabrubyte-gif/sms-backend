import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { Mark } from './entities/mark.entity';
import { Student } from 'src/student/entities/student.entity';
import { Course } from 'src/course/entities/course.entity';
import { CreateMarkDto } from './dto/create-mark.dto';
import { MarkDto } from './dto/mark.dto';

@Injectable()
export class MarksService {
  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {}

  public async addMarks(createMarkDto: CreateMarkDto): Promise<MarkDto> {
    const { student_id, course_id, exam_type, score, max_score, mark_id } =
      createMarkDto;

    const student = await this.entityManager.findOne(Student, {
      where: { student_id: student_id },
    });
    if (!student) {
      throw new NotFoundException('Student not found');
    }

    const course = await this.entityManager.findOne(Course, {
      where: { course_id: course_id },
    });
    if (!course) {
      throw new NotFoundException('Course not found');
    }

    const mark = this.entityManager.create(Mark, {
      student,
      course,
      exam_type,
      score,
      max_score,
      mark_id,
    });

    return await this.entityManager.save(mark);
  }

  public async findByStudent(student_id: string): Promise<MarkDto[]> {
    return await this.entityManager.find(Mark, {
      where: { student: { student_id: student_id } },
      relations: ['course'],
    });
  }

  public async findByCourse(course_id: string): Promise<MarkDto[]> {
    return await this.entityManager.find(Mark, {
      where: { course: { course_id: course_id } },
      relations: ['student'],
    });
  }
}
