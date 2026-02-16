/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable prettier/prettier */
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Book } from './entities/book.entity';
import { Student } from '../student/entities/student.entity';
import { BookAssignment } from './entities/book-assignment.entity';
import { BookStatus } from './enums/book-status.enum';
import { CreateBookDto } from './dto/create-book.dto';
import { AssignBookDto } from './dto/assign-book.dto';
import { ReturnBookDto } from './dto/return-book.dto';

@Injectable()
export class LibraryService {
  constructor(
    @InjectRepository(Book)
    private readonly bookRepo: Repository<Book>,

    @InjectRepository(Student)
    private readonly studentRepo: Repository<Student>,

    @InjectRepository(BookAssignment)
    private readonly assignmentRepo: Repository<BookAssignment>,
  ) {}

  async addBook(dto: CreateBookDto) {
    const book = this.bookRepo.create({
      title: dto.title,
      bookClass: dto.bookClass,
      total_quantity: dto.total_quantity,
      status:
        dto.total_quantity > 0
          ? BookStatus.AVAILABLE
          : BookStatus.UNAVAILABLE,
    });

    return await this.bookRepo.save(book);
  }

  async getBooks() {
    return await this.bookRepo.find();
  }

  async assignBook(dto: AssignBookDto) {
    const book = await this.bookRepo.findOne({
      where: { id: dto.bookId },
    });

    if (!book)
      throw new BadRequestException('Book not found');

    if (book.total_quantity <= 0)
      throw new BadRequestException('Book out of stock');

    if (book.status !== BookStatus.AVAILABLE)
      throw new BadRequestException('Book unavailable');

    const student = await this.studentRepo.findOne({
      where: { student_id: dto.studentId },
    });

    if (!student)
      throw new BadRequestException('Student not found');

    const assignment = this.assignmentRepo.create({
      book,
      student,
      status: BookStatus.ISSUED,
    });

    book.total_quantity -= 1;

    if (book.total_quantity === 0)
      book.status = BookStatus.UNAVAILABLE;

    await this.bookRepo.save(book);

    return await this.assignmentRepo.save(assignment);
  }

  async returnBook(dto: ReturnBookDto) {
    const assignment = await this.assignmentRepo.findOne({
      where: { book: { id: dto.bookId } },
      relations: ['book'],
    });

    if (!assignment)
      throw new BadRequestException('Assignment not found');

    if (assignment.status === BookStatus.RETURNED)
      throw new BadRequestException('Already returned');

    assignment.status = BookStatus.RETURNED;

    assignment.book.total_quantity += 1;
    assignment.book.status = BookStatus.AVAILABLE;

    await this.bookRepo.save(assignment.book);

    return await this.assignmentRepo.save(assignment);
  }

  async getStudentBooks(studentId: string) {
    return await this.assignmentRepo.find({
      where: {
        student: { student_id: studentId },
        status: BookStatus.ISSUED,
      },
      relations: ['book'],
    });
  }


  
async findAllRecords() {
  return this.assignmentRepo.find({
    relations: ["student", "book"],
    order: { issuedAt: "DESC" }
  });
}


async updateRecord(id: string, body: any) {
  const record = await this.assignmentRepo.findOne({
    where: { id },
    relations: ["book", "student"]
  });

  if (!record)
    throw new BadRequestException("Record not found");

  if (body.studentId) {
    const student = await this.studentRepo.findOne({
      where: { student_id: body.studentId }
    });

    if (!student)
      throw new BadRequestException("Student not found");

    record.student = student;
  }

  if (body.bookId) {
    const book = await this.bookRepo.findOne({
      where: { id: body.bookId }
    });

    if (!book)
      throw new BadRequestException("Book not found");

    record.book = book;
  }

  if (body.status)
    record.status = body.status;

  return this.assignmentRepo.save(record);
}

async getSingleRecord(id: string) {
  return this.assignmentRepo.findOne({
    where: { id },
    relations: ["student", "book"]
  });
}

async deleteRecord(id: string) {
  const record = await this.assignmentRepo.findOne({
    where: { id },
    relations: ["book"]
  });

  if (!record)
    throw new BadRequestException("Record not found");

  // stock wapas add
  record.book.total_quantity += 1;
  record.book.status = BookStatus.AVAILABLE;

  await this.bookRepo.save(record.book);

  return await this.assignmentRepo.remove(record);
}

async getRecordById(id: string) {
  const record = await this.assignmentRepo.findOne({
    where: { id },
    relations: ["student", "book"]
  });

  if (!record)
    throw new BadRequestException("Record not found");

  return record;
}


}
