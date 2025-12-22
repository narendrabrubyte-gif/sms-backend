import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from './entities/student.entity';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(Student)
    private studentRepository: Repository<Student>,
  ) {}

  async create(createStudentDto: CreateStudentDto): Promise<Student> {
    const student = this.studentRepository.create(createStudentDto);
    return this.studentRepository.save(student);
  }

  async findAll(
    search?: string,
    status?: string,
    page: number = 1,
    limit: number = 10,
  ) {
    const skip = (page - 1) * limit;

    // Query Builder start karein
    const query = this.studentRepository.createQueryBuilder('student');

    // 1. Status Filter
    if (status) {
      query.andWhere('student.status = :status', { status });
    }

    // 2. Search Filter (First Name, Last Name ya Email par search karega)
    if (search) {
      query.andWhere(
        '(student.first_name LIKE :search OR student.last_name LIKE :search OR student.email LIKE :search)',
        { search: `%${search}%` },
      );
    }

    // 3. Pagination Apply karein
    query.skip(skip).take(limit);

    // 4. Data aur Total count layein
    const [data, total] = await query.getManyAndCount();

    return {
      data,
      meta: {
        total,
        page,
        limit,
        last_page: Math.ceil(total / limit),
      },
    };
  }
  async findOne(student_id: string) {
    const student = await this.studentRepository.findOne({
      where: { student_id: student_id },
    });
    if (!student) {
      throw new NotFoundException(`Student with ID ${student_id} not found`);
    }
    return student;
  }

  async update(student_id: string, updateStudentDto: UpdateStudentDto) {
    const student = await this.findOne(student_id);
    Object.assign(student, updateStudentDto);
    return await this.studentRepository.save(student);
  }

  async remove(student_id: string) {
    const student = await this.findOne(student_id);
    return await this.studentRepository.remove(student);
  }
}
