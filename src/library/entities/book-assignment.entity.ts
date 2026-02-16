import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  CreateDateColumn,
} from 'typeorm';

import { Book } from './book.entity';
import { Student } from '../../student/entities/student.entity';
import { BookStatus } from '../enums/book-status.enum';

@Entity()
export class BookAssignment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Book, (book) => book.assignments)
  book: Book;

 @ManyToOne(() => Student)
  student: Student;

  @Column({
    type: 'enum',
    enum: BookStatus,
    default: BookStatus.ISSUED,
  })
  status: BookStatus;

  @CreateDateColumn()
  issuedAt: Date;
}
