import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Enrollment } from './entities/enrollment.entity';
import { Student } from '../student/entities/student.entity';
import { Course } from '../course/entities/course.entity';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';

@Injectable()
export class EnrollmentService {
  constructor(
    @InjectRepository(Enrollment)
    private enrollmentRepository: Repository<Enrollment>,
    @InjectRepository(Student)
    private studentRepository: Repository<Student>,
    @InjectRepository(Course)
    private courseRepository: Repository<Course>,
  ) {}

  async create(createEnrollmentDto: CreateEnrollmentDto) {
    const { student_id, course_id } = createEnrollmentDto;

    const student = await this.studentRepository.findOne({
      where: { student_id: student_id },
    });
    if (!student) {
      throw new NotFoundException(`Student with ID ${student_id} not found`);
    }
    const course = await this.courseRepository.findOne({
      where: { course_id: course_id },
    });
    if (!course) {
      throw new NotFoundException(`Course with ID ${course_id} not found`);
    }

    const exists = await this.enrollmentRepository.findOne({
      where: { student: student, course: course },
    });

    if (exists) {
      throw new BadRequestException('Student already enrolled in this course');
    }

    const enrollment = this.enrollmentRepository.create({ student, course });
    return await this.enrollmentRepository.save(enrollment);
  }

  async findStudentCourses(student_ID: string) {
    return await this.enrollmentRepository.find({
      where: { student: { student_id: student_ID } },
      relations: ['course'],
    });
  }

  async findCourseStudents(course_ID: string) {
    return await this.enrollmentRepository.find({
      where: { course: { course_id: course_ID } },
      relations: ['student'],
    });
  }

  async remove(enrollment_id: string) {
    const enrollment = await this.enrollmentRepository.findOne({
      where: { enrollment_id: enrollment_id },
    });
    if (!enrollment) {
      throw new NotFoundException(
        `Enrollment with ID ${enrollment_id} not found`,
      );
    }
    return await this.enrollmentRepository.remove(enrollment);
  }
}
