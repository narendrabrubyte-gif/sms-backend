/* eslint-disable prettier/prettier */
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from 'typeorm';

import { BookAssignment } from './book-assignment.entity';
import { BookStatus } from '../enums/book-status.enum';

@Entity('books')
export class Book {
  category(category: any): any {
    throw new Error("Method not implemented.");
  }
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ name: 'book_class', default: 'General' })
  bookClass: string;


  @Column({ name: 'total_quantity', type: 'int' })
  total_quantity: number;

  @Column({
    type: 'enum',
    enum: BookStatus,
    default: BookStatus.AVAILABLE,
  })
  status: BookStatus;

  @OneToMany(
    () => BookAssignment,
    (assignment) => assignment.book,
  )
  assignments: BookAssignment[];
}
