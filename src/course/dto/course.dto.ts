import { Expose } from 'class-transformer';
import { IsString, IsUUID } from 'class-validator';
import { Course } from '../entities/course.entity';
export class CourseDto {
  @Expose()
  @IsUUID()
  public readonly course_id: string;

  @Expose()
  @IsString()
  public readonly name: string;

  @Expose()
  @IsString()
  public readonly description: string;

  @Expose()
  @IsString()
  public readonly credits: string;

  public constructor(value: CourseDto) {
    Object.assign(this, value);
  }

  public static createFromEntity(entity: Course): CourseDto {
    return new CourseDto({
      course_id: entity.course_id,
      name: entity.name,
      description: entity.description,
      credits: entity.credits,
    });
  }
}
