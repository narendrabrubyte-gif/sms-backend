import { IsInt, IsString } from 'class-validator';

export class CreateBookDto {
  @IsString()
  title: string;

  @IsString()
  bookClass: string;

  @IsInt()
  total_quantity: number;
}
