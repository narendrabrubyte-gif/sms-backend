import {
  BadGatewayException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Attendance } from './entities/attendance.entity';
import { InjectEntityManager } from '@nestjs/typeorm';
import { Between, EntityManager, FindOptionsWhere } from 'typeorm';
import { Student } from '../student/entities/student.entity';
import { Course } from '../course/entities/course.entity';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { AttendanceDto } from './dto/attendance.dto';

@Injectable()
export class AttendanceService {
  public constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {}

  public async addAttendance(
    createAttendanceDto: CreateAttendanceDto,
  ): Promise<AttendanceDto> {
    const { student_id, course_id, date, status, remarks } =
      createAttendanceDto;

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
    const attendance = this.entityManager.create(Attendance, {
      student,
      course,
      date,
      status,
      remarks,
    });
    return await this.entityManager.save(attendance);
  }

  async findByStudent(
    student_Id: string,
    form?: string,
    to?: string,
  ): Promise<AttendanceDto[]> {
    const whereCondition: FindOptionsWhere<Attendance> = {
      student: { student_id: student_Id },
    };
    if (form && to) {
      const startDate = new Date(form);
      const endDate = new Date(to);
      endDate.setDate(endDate.getDate() + 1);
      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        throw new BadGatewayException('Invalid date rang');
      }
      whereCondition.date = Between(startDate, endDate);
    }
    return await this.entityManager.find(Attendance, {
      where: whereCondition,
      relations: ['course'],
      order: { date: 'DESC' },
    });
  }

  async findByCourse(
    course_Id: string,
    date?: string,
  ): Promise<AttendanceDto[]> {
    const whereCondition: FindOptionsWhere<Attendance> = {
      course: { course_id: course_Id },
    };

    if (date) {
      whereCondition.date = new Date(date);
    }

    return await this.entityManager.find(Attendance, {
      where: whereCondition,
      relations: ['student'],
    });
  }
}
