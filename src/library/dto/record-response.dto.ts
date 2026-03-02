import { Expose, Type } from 'class-transformer';
import { IsEnum, IsUUID, IsOptional } from 'class-validator';
import { BookAssignment } from '../entities/book-assignment.entity';
import { BookStatus } from '../enums/book-status.enum';
import { StudentDto } from 'src/student/dto/student.dto';
import { BookResponseDto } from './book-response.dto'; // assume ye already hai

export class RecordResponseDto {
  @Expose()
  @IsUUID()
  public readonly id: string;

  @Expose()
  @Type(() => StudentDto)
  @IsOptional()
  public readonly student: StudentDto | null;

  @Expose()
  @Type(() => BookResponseDto)
  @IsOptional()
  public readonly book: BookResponseDto | null;

  @Expose()
  @IsEnum(BookStatus)
  public readonly status: BookStatus;

  @Expose()
  public readonly issuedAt: Date;

  @Expose()
  public readonly returnedAt: Date | null;

  constructor(values: Partial<RecordResponseDto>) {
    Object.assign(this, values);
  }

  static createFromEntity(entity: BookAssignment): RecordResponseDto {
    return new RecordResponseDto({
      id: entity.id,
      student: entity.student
        ? StudentDto.createFromEntity(entity.student)
        : null,
      book: entity.book ? BookResponseDto.createFromEntity(entity.book) : null,
      status: entity.status,
      issuedAt: entity.issuedAt,
      returnedAt: entity.returnedAt,
    });
  }
}
