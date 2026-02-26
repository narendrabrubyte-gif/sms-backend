import { Expose } from 'class-transformer';
import { IsEnum, IsString, IsUUID } from 'class-validator';
import { User, UserRole } from '../entities/user.entity';

export class UserDto {
  @Expose()
  @IsUUID()
  public readonly user_id: string;

  @Expose()
  @IsString()
  public readonly name: string;

  @Expose()
  @IsString()
  public readonly email: string;

  @Expose()
  @IsEnum(UserRole)
  public readonly role: UserRole;

  public constructor(values: UserDto) {
    Object.assign(this, values);
  }

  public static createFromEntity(entity: User): UserDto {
    return new UserDto({
      user_id: entity.user_id,
      name: entity.name,
      email: entity.email,
      role: entity.role,
    });
  }
}
