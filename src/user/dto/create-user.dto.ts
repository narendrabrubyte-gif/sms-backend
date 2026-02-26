import {
  IsEnum,
  IsString,
  IsEmail,
  IsNotEmpty,
  MinLength,
} from 'class-validator';
import { UserRole } from '../entities/user.entity';

export class CreateUserDto {
  @IsEnum(UserRole)
  public role: UserRole;

  @IsString()
  @IsNotEmpty()
  public name: string;

  @IsEmail()
  @IsNotEmpty()
  public email: string;

  @IsString()
  @MinLength(6)
  public readonly password: string;

  public constructor(values: CreateUserDto) {
    Object.assign(this, values);
  }
}
