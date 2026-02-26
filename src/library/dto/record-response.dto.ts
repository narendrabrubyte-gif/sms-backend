/* eslint-disable prettier/prettier */
import { Expose, Type } from "class-transformer";
import { BookAssignment } from "../entities/book-assignment.entity";
import { BookStatus } from "../enums/book-status.enum";

export class RecordResponseDto {
  @Expose()
  id: string;

  @Expose()
  student?: {
    id: string;
    name: string;
  };

  @Expose()
  book?: {
    id: string;
    title: string;
  };

  @Expose()
  status: BookStatus;

  @Expose()
  issuedAt: Date;

  @Expose()
  returnedAt?: Date | null;

  constructor(partial: Partial<RecordResponseDto>) {
    Object.assign(this, partial);
  }

  static createFromEntity(entity: BookAssignment): RecordResponseDto {
    return new RecordResponseDto({
      id: entity.id,

      student: entity.student
        ? {
            id: entity.student.student_id,
            name: `${entity.student.first_name} ${entity.student.last_name}`,
          }
        : {
            id: "N/A",
            name: "Deleted Student",
          },

      book: entity.book
        ? {
            id: entity.book.id,
            title: entity.book.title,
          }
        : {
            id: "N/A",
            title: "Deleted Book",
          },

      status: entity.status,
      issuedAt: entity.issuedAt,
      returnedAt: entity.returnedAt ?? null,
    });
  }
}