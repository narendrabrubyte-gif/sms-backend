import {
  IsEnum,
  IsUUID,
  IsDateString,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';
import { EnrollmentStatus } from '../entities/enrollment.entity';

export class CreateEnrollmentDto {
  @IsUUID()
  @IsNotEmpty()
  student_id: string;

  @IsUUID()
  @IsNotEmpty()
  course_id: string;

  @IsDateString()
  enrolled_on: string;

  @IsOptional()
  @IsEnum(EnrollmentStatus)
  status: EnrollmentStatus;
}
