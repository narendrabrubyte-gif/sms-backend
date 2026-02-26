/* eslint-disable prettier/prettier */
import { Expose } from "class-transformer";
import { Book } from "../entities/book.entity";
import { BookStatus } from "../enums/book-status.enum";

export class BookResponseDto {
  @Expose()
  id: string;

  @Expose()
  title: string;

  @Expose()
  bookClass: string;

  @Expose()
  total_quantity: number;

  @Expose()
  status: BookStatus;

  constructor(partial: Partial<BookResponseDto>) {
    Object.assign(this, partial);
  }

  public static createFromEntity(entity: Book): BookResponseDto {
    return new BookResponseDto({
      id: entity.id,
      title: entity.title,
      bookClass: entity.bookClass,
      total_quantity: entity.total_quantity,
      status: entity.status,
    });
  }
}