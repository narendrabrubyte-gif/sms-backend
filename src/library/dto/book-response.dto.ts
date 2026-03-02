/* eslint-disable prettier/prettier */
import { Expose } from "class-transformer";
import { IsEnum, IsUUID, IsString, IsNumber } from "class-validator";
import { Book } from "../entities/book.entity";
import { BookStatus } from "../enums/book-status.enum";

export class BookResponseDto {
  @Expose()
  @IsUUID()
  public readonly id: string;

  @Expose()
  @IsString()
  public readonly title: string;

  @Expose()
  @IsString()
  public readonly bookClass: string;

  @Expose()
  @IsNumber()
  public readonly total_quantity: number;

  @Expose()
  @IsEnum(BookStatus)
  public readonly status: BookStatus;

  public constructor(values: BookResponseDto) {
    Object.assign(this, values);
  }

  public static createFromEntity(entity: Book): BookResponseDto {
    return new BookResponseDto({
      ...entity
    });
  }
}