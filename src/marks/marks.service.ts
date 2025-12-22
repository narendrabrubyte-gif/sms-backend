import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Mark } from './entities/mark.entity';
import { Student } from 'src/student/entities/student.entity';
import { Course } from 'src/course/entities/course.entity';
import { CreateMarkDto } from './dto/create-mark.dto';

@Injectable()
export class MarksService {
  constructor(
    @InjectRepository(Mark)
    private markRepository: Repository<Mark>,
    @InjectRepository(Student)
    private studentRepository: Repository<Student>,
    @InjectRepository(Course)
    private courseRepository: Repository<Course>,
  ) {}

  private calculateGrade(score: number, maxScore: number): string {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 90) {
      return 'A';
    } else if (percentage >= 80) {
      return 'B';
    } else if (percentage >= 70) {
      return 'C';
    } else if (percentage >= 60) {
      return 'D';
    } else {
      return 'F';
    }
  }

  async create(createMarkDto: CreateMarkDto) {
    const { student_id, course_id, exam_type, score, max_score } =
      createMarkDto;

    const student = await this.studentRepository.findOne({
      where: { student_id: student_id },
    });
    if (!student) {
      throw new NotFoundException('Student not found');
    }

    const course = await this.courseRepository.findOne({
      where: { course_id: course_id },
    });
    if (!course) {
      throw new NotFoundException('Course not found');
    }

    const mark = this.markRepository.create({
      student,
      course,
      exam_type,
      score,
      max_score,
    });

    const savedMark = await this.markRepository.save(mark);
    return {
      ...savedMark,
      grade: this.calculateGrade(savedMark.score, savedMark.max_score),
    };
  }

  async findByStudent(student_id: string) {
    const marks = await this.markRepository.find({
      where: { student: { student_id: student_id } },
      relations: ['course'],
    });

    return marks.map((mark) => ({
      ...mark,
      grade: this.calculateGrade(mark.score, mark.max_score),
    }));
  }

  async findByCourse(course_id: string) {
    const marks = await this.markRepository.find({
      where: { course: { course_id: course_id } },
      relations: ['student'],
    });
    return marks.map((mark) => ({
      ...mark,
      grade: this.calculateGrade(mark.score, mark.max_score),
    }));
  }

  // async findOne(mark_id: string) {
  //   const mark = await this.markRepository.findOne({
  //     where: { mark_id },
  //     relations: ['student', 'course'],
  //   });

  //   if (!mark) {
  //     throw new NotFoundException(`Mark with ID ${mark_id} not found`);
  //   }

  //   return {
  //     ...mark,
  //     grade: this.calculateGrade(mark.score, mark.max_score),
  //   };
  // }

  // async update(mark_id: string, updateMarkDto: CreateMarkDto) {
  //   const mark = await this.markRepository.findOne({ where: { mark_id } });

  //   if (!mark) {
  //     throw new NotFoundException(`Mark with ID ${mark_id} not found`);
  //   }

  //   // Update fields from DTO
  //   Object.assign(mark, updateMarkDto);

  //   const updatedMark = await this.markRepository.save(mark);

  //   return {
  //     ...updatedMark,
  //     grade: this.calculateGrade(updatedMark.score, updatedMark.max_score),
  //   };
  // }

  // async remove(mark_id: string) {
  //   const result = await this.markRepository.delete(mark_id);
  //   if (result.affected === 0) {
  //     throw new NotFoundException(`Mark with ID ${mark_id} not found`);
  //   }
  // }
}
