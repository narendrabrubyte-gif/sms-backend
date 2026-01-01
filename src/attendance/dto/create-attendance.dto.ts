import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
export enum AttendanceStatus {
  PRESENT = 'present',
  ABSENT = 'absent',
}

export class CreateAttendanceDto {
  @IsString()
  @IsNotEmpty()
  public student_id: string;

  @IsString()
  @IsNotEmpty()
  public course_id: string;

  @IsDateString()
  @IsNotEmpty()
  public date: Date;

  @IsString()
  @IsNotEmpty()
  @IsEnum(AttendanceStatus)
  public status: AttendanceStatus;

  @IsString()
  @IsOptional()
  public remarks: string;

  public constructor(values: CreateAttendanceDto) {
    Object.assign(this, values);
  }
}
