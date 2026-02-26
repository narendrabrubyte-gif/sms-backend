/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LibraryController } from './library.controller';
import { LibraryService } from './library.service';

import { Book } from './entities/book.entity';
import { Student } from '../student/entities/student.entity';
import { BookAssignment } from './entities/book-assignment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Book,
      Student,
      BookAssignment,
    ]),
  ],
  controllers: [LibraryController],
  providers: [LibraryService],
})
export class LibraryModule {}
