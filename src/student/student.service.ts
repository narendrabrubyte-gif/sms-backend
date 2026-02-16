import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { Brackets, EntityManager } from 'typeorm';
import { Student } from './entities/student.entity';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { StudentDto } from './dto/student.dto';

@Injectable()
export class StudentService {
  public constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {}

  public async createStudent(
    createStudentDto: CreateStudentDto,
  ): Promise<StudentDto> {
    const { email } = createStudentDto;
    const existingStudent = await this.entityManager.findOne(Student, {
      where: { email: email },
    });
    if (existingStudent) {
      throw new BadRequestException('Student with this email already exists');
    }
    const student = this.entityManager.create(Student, createStudentDto);
    const saveStudent = await this.entityManager.save(student);

    return StudentDto.createFromEntity(saveStudent);
  }

  public async getStudentsList(
    search?: string,
    status?: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<{
    data: StudentDto[];
    meta: { total: number; page: number; limit: number; last_page: number };
  }> {
    const skip = (page - 1) * limit;

    const whereClause = this.entityManager.createQueryBuilder(
      Student,
      'student',
    );

    if (status) {
      whereClause.andWhere('student.status= :ststus', { status });
    }

    if (search) {
      whereClause.andWhere(
        new Brackets((whereClause) => {
          whereClause
            .where('student.first_name LIKE :search')
            .orWhere('student.last_name LIKE :search')
            .orWhere('student.email LIKE :search');
        }),
        { search: `%${search}%` },
      );
    }

    whereClause.orderBy('student.created_at', 'DESC').take(limit).skip(skip);

    const [student, total]: [Student[], number] =
      await whereClause.getManyAndCount();

    return {
      data: student.map((student: Student) =>
        StudentDto.createFromEntity(student),
      ),
      meta: { total, limit, page, last_page: Math.ceil(total / limit) },
    };
  }

  public async getStudentById(student_id: string): Promise<StudentDto> {
    const student = await this.entityManager.findOne(Student, {
      where: { student_id: student_id },
    });
    if (!student) {
      throw new NotFoundException(`Student with ID ${student_id} not found`);
    }
    return StudentDto.createFromEntity(student);
  }

  public async updateStudent(
    student_id: string,
    updateStudentDto: UpdateStudentDto,
  ): Promise<StudentDto> {
    const student = await this.entityManager.findOne(Student, {
      where: { student_id },
    });

    if (!student) {
      throw new NotFoundException(`Student with ID${student_id} not found.`);
    }

    Object.assign(student, updateStudentDto);

    const studentUpdate = await this.entityManager.save(student);

    return StudentDto.createFromEntity(studentUpdate);
  }

// async remove(id: string) {
//   const student = await this.studentRepo.findOne({
//     where: { student_id: id },
//   });

//   if (!student) {
//     throw new NotFoundException('Student not found');
//   }

//   await this.studentRepo.delete(id);

//   return { message: 'Student deleted successfully' };
// }


  public async deleteStudent(student_id: string): Promise<void> {
    const student = await this.entityManager.findOne(Student, {
      where: { student_id },
    });

    if (!student) {
      throw new NotFoundException(`Student Id${student_id} is not found.`);
    }
    await this.entityManager.remove(student);
  }
  findAll() {
  return this.entityManager.find(Student);
}

}
