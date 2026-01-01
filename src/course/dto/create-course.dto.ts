import { IsString, IsNotEmpty } from 'class-validator';

export class CreateCourseDto {
  @IsString()
  @IsNotEmpty()
  public name: string;

  @IsString()
  public description: string;

  @IsString()
  @IsNotEmpty()
  public credits: string;
}
