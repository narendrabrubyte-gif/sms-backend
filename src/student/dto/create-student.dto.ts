import {
  IsEnum,
  IsString,
  IsEmail,
  IsDateString,
  IsNotEmpty,
} from 'class-validator';
import { StudentStatus } from '../entities/student.entity';

export class CreateStudentDto {
  @IsString()
  @IsNotEmpty()
  public first_name: string;

  @IsString()
  @IsNotEmpty()
  public last_name: string;

  @IsEmail()
  public email: string;

  @IsString()
  public phone: string;

  @IsDateString()
  public dob: string;

  @IsString()
  public gender: string;

  @IsString()
  public address: string;

  @IsEnum(StudentStatus)
  public status: StudentStatus;

  public constructor(values: CreateStudentDto) {
    Object.assign(this, values);
  }
}
