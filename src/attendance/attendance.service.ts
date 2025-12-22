import {
  BadGatewayException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Attendance } from './entities/attendance.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, FindOptionsWhere, Repository } from 'typeorm';
import { Student } from '../student/entities/student.entity';
import { Course } from '../course/entities/course.entity';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
// import { UpdateAttendanceDto } from './dto/update-attendance.dto';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(Attendance)
    private attendenceRepository: Repository<Attendance>,
    @InjectRepository(Student)
    private studentRepository: Repository<Student>,
    @InjectRepository(Course)
    private courseRepository: Repository<Course>,
  ) {}
  async create(createAttendanceDto: CreateAttendanceDto) {
    const { student_id, course_id, date, status, remarks } =
      createAttendanceDto;

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
    const attendance = this.attendenceRepository.create({
      student,
      course,
      date,
      status,
      remarks,
    });
    return await this.attendenceRepository.save(attendance);
  }

  async findByStudent(student_Id: string, form?: string, to?: string) {
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
    return await this.attendenceRepository.find({
      where: whereCondition,
      relations: ['course'],
      order: { date: 'DESC' },
    });
  }

  async findByCourse(course_Id: string, date?: string) {
    const whereCondition: FindOptionsWhere<Attendance> = {
      course: { course_id: course_Id },
    };

    if (date) {
      whereCondition.date = new Date(date);
    }

    return await this.attendenceRepository.find({
      where: whereCondition,
      relations: ['student'],
    });
  }
}
