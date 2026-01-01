import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { Enrollment } from './entities/enrollment.entity';
import { Student } from '../student/entities/student.entity';
import { Course } from '../course/entities/course.entity';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { EnrollmentDto } from './dto/enrollment.dto';

@Injectable()
export class EnrollmentService {
  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {}

  public async addEnrollment(
    createEnrollmentDto: CreateEnrollmentDto,
  ): Promise<EnrollmentDto> {
    const { student_id, course_id } = createEnrollmentDto;

    const student = await this.entityManager.findOne(Student, {
      where: { student_id: student_id },
    });
    if (!student) {
      throw new NotFoundException(`Student with ID ${student_id} not found`);
    }
    const course = await this.entityManager.findOne(Course, {
      where: { course_id: course_id },
    });
    if (!course) {
      throw new NotFoundException(`Course with ID ${course_id} not found`);
    }

    const exists = await this.entityManager.findOne(Enrollment, {
      where: { student: student, course: course },
    });

    if (exists) {
      throw new BadRequestException('Student already enrolled in this course');
    }

    const enrollment = this.entityManager.create(Enrollment, {
      student,
      course,
    });
    return await this.entityManager.save(enrollment);
  }

  public async getStudentCourses(student_ID: string): Promise<EnrollmentDto[]> {
    return await this.entityManager.find(Enrollment, {
      where: { student: { student_id: student_ID } },
      relations: ['course'],
    });
  }

  public async getCourseStudents(course_ID: string): Promise<Enrollment[]> {
    return await this.entityManager.find(Enrollment, {
      where: { course: { course_id: course_ID } },
      relations: ['student'],
    });
  }

  public async deleteEnrollment(enrollment_id: string): Promise<void> {
    const enrollment = await this.entityManager.findOne(Enrollment, {
      where: { enrollment_id: enrollment_id },
    });
    if (!enrollment) {
      throw new NotFoundException(
        `Enrollment with ID ${enrollment_id} not found`,
      );
    }
    await this.entityManager.remove(enrollment);
  }
}
