/* eslint-disable prettier/prettier */
import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';

import { Book } from './entities/book.entity';
import { Student } from '../student/entities/student.entity';
import { BookAssignment } from './entities/book-assignment.entity';

import { BookStatus } from './enums/book-status.enum';

import { CreateBookDto } from './dto/create-book.dto';
import { AssignBookDto } from './dto/assign-book.dto';
import { ReturnBookDto } from './dto/return-book.dto';
import { UpdateRecordDto } from './dto/update-record.dto';

import { BookResponseDto } from './dto/book-response.dto';
import { RecordResponseDto } from './dto/record-response.dto';

@Injectable()
export class LibraryService {
  public constructor(
    @InjectEntityManager()
    private readonly manager: EntityManager,
  ) {}

  public async addBook(dto: CreateBookDto): Promise<BookResponseDto> {
    const book = this.manager.create(Book, {
      ...dto,
      status:
        dto.total_quantity > 0
          ? BookStatus.AVAILABLE
          : BookStatus.UNAVAILABLE,
    });

    const saved = await this.manager.save(book);
    return BookResponseDto.createFromEntity(saved);
  }

  public async getBooks(): Promise<BookResponseDto[]> {
    const books = await this.manager.find(Book);
    return books.map((b) =>
      BookResponseDto.createFromEntity(b),
    );
  }

  public async assignBook(dto: AssignBookDto): Promise<RecordResponseDto> {
    const book = await this.manager.findOne(Book, {
      where: { id: dto.bookId },
    });

    if (!book) throw new NotFoundException('Book not found');
    if (book.total_quantity <= 0)
      throw new BadRequestException('Book not available');

    const student = await this.manager.findOne(Student, {
      where: { student_id: dto.studentId },
    });

    if (!student) throw new NotFoundException('Student not found');

    const assignment = this.manager.create(BookAssignment, {
      book,
      student,
      status: BookStatus.ISSUED,
      issuedAt: new Date(),
    });

    await this.manager.save(assignment);

    book.total_quantity -= 1;
    if (book.total_quantity === 0) {
      book.status = BookStatus.UNAVAILABLE;
    }

    await this.manager.save(book);

    const full = await this.manager.findOne(BookAssignment, {
      where: { id: assignment.id },
      relations: ['student', 'book'],
    });

    return RecordResponseDto.createFromEntity(full!);
  }

  public async returnBook(
    dto: ReturnBookDto,
  ): Promise<RecordResponseDto> {
    const { id } = dto;

    const record = await this.manager.findOne(BookAssignment, {
      where: { id },
      relations: ['book', 'student'],
    });

    if (!record) throw new NotFoundException('Record not found');
    if (record.status === BookStatus.RETURNED)
      throw new BadRequestException('Book already returned');

    record.status = BookStatus.RETURNED;
    record.returnedAt = new Date();

    await this.manager.save(record);

    record.book.total_quantity += 1;
    record.book.status = BookStatus.AVAILABLE;

    await this.manager.save(record.book);

    return RecordResponseDto.createFromEntity(record);
  }

  public async findAllRecords(): Promise<RecordResponseDto[]> {
    const records = await this.manager.find(BookAssignment, {
      relations: ['student', 'book'],
    });

    return records.map((r) =>
      RecordResponseDto.createFromEntity(r),
    );
  }

  public async getSingleRecord(id: string): Promise<RecordResponseDto> {
    const record = await this.manager.findOne(BookAssignment, {
      where: { id },
      relations: ['student', 'book'],
    });

    if (!record) throw new NotFoundException('Record not found');

    return RecordResponseDto.createFromEntity(record);
  }

public async updateRecord(
  id: string,
  dto: UpdateRecordDto,
): Promise<RecordResponseDto> {

  const record = await this.manager.findOne(BookAssignment, {
    where: { id },
    relations: ['student', 'book'],
  });

  if (!record) {
    throw new NotFoundException('Record not found');
  }

  // Update Student
  if (dto.studentId) {
    const student = await this.manager.findOne(Student, {
      where: { student_id: dto.studentId },
    });

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    record.student = student;
  }

  // Update Book
  if (dto.bookId) {
    const book = await this.manager.findOne(Book, {
      where: { id: dto.bookId },
    });

    if (!book) {
      throw new NotFoundException('Book not found');
    }

    record.book = book;
  }

  // STATUS LOGIC FIX
  if (dto.status) {

    record.status = dto.status;

    // If RETURNED → set current date
    if (dto.status === BookStatus.RETURNED) {
      record.returnedAt = new Date();
    }

    // If changed back to ISSUED → clear return date
    if (dto.status === BookStatus.ISSUED) {
      record.returnedAt = null;
    }
  }

  await this.manager.save(record);

  const updated = await this.manager.findOne(BookAssignment, {
    where: { id },
    relations: ['student', 'book'],
  });

  return RecordResponseDto.createFromEntity(updated!);
}

  public async deleteRecord(id: string): Promise<void> {
    const record = await this.manager.findOne(BookAssignment, {
      where: { id },
    });

    if (!record) throw new NotFoundException('Record not found');

    await this.manager.remove(record);
  }
}