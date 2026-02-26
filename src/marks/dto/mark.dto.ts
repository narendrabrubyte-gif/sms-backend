import { Expose, Type } from 'class-transformer';
import { IsEnum, IsNumber, IsUUID } from 'class-validator';
import { CourseDto } from 'src/course/dto/course.dto';
import { StudentDto } from 'src/student/dto/student.dto';
import { ExamType, Mark } from '../entities/mark.entity';

export class MarkDto {
  @Expose()
  @IsUUID()
  public readonly mark_id: string;

  @Expose()
  @Type(() => StudentDto)
  public readonly student: StudentDto | null;

  @Expose()
  @Type(() => CourseDto)
  public course: CourseDto | null;

  @Expose()
  @IsEnum(ExamType)
  public readonly exam_type: ExamType;

  @Expose()
  @IsNumber()
  public readonly score: number;

  @Expose()
  @IsNumber()
  public readonly max_score: number;

  public constructor(values: MarkDto) {
    Object.assign(this, values);
  }

  public static createFromEntity(entity: Mark): MarkDto {
    return new MarkDto({
      mark_id: entity.mark_id,
      student: entity.student
        ? StudentDto.createFromEntity(entity.student)
        : null,
      course: entity.course ? CourseDto.createFromEntity(entity.course) : null,
      exam_type: entity.exam_type,
      score: entity.score,
      max_score: entity.max_score,
    });
  }
}
