/* eslint-disable prettier/prettier */
import { IsOptional, IsUUID, IsEnum } from "class-validator";
import { BookStatus } from "../enums/book-status.enum";

export class UpdateRecordDto {
  @IsOptional()
  @IsUUID()
  studentId?: string;

  @IsOptional()
  @IsUUID()
  bookId?: string;

  @IsOptional()
  @IsEnum(BookStatus)
  status?: BookStatus;
}
