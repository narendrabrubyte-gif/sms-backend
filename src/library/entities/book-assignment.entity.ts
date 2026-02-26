/* eslint-disable prettier/prettier */
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';

import { Book } from './book.entity';
import { Student } from '../../student/entities/student.entity';
import { BookStatus } from '../enums/book-status.enum';

@Entity()
export class BookAssignment {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Book, (book) => book.assignments)
  @JoinColumn({ name: "book_id" })
  public book: Book;

  @ManyToOne(() => Student)
  @JoinColumn({ name: "student_id" })
  public student: Student;

  @Column({
    type: 'enum',
    enum: BookStatus,
    default: BookStatus.ISSUED,
  })
  status: BookStatus;

  @CreateDateColumn()
  issuedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  returnedAt: Date | null;
}