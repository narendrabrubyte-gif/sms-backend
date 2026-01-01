import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager, Equal } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UserService {
  private readonly _logger = new Logger(UserService.name);

  constructor(
    @InjectEntityManager() private readonly _entityManager: EntityManager,
  ) {}

  public async createUser(createUserDto: CreateUserDto): Promise<UserDto> {
    this._logger.log(`Creating user: ${createUserDto.email}`);

    const existingUser = await this._entityManager.findOne(User, {
      where: { email: Equal(createUserDto.email) },
    });

    if (existingUser) throw new BadRequestException('Email already exists');

    return await this._entityManager.transaction(async (manager) => {
      const hashedPassword = await bcrypt.hash(createUserDto.password, 12);

      const user = manager.create(User, {
        ...createUserDto,
        password_hash: hashedPassword,
      });

      const savedUser = await manager.save(user);
      return UserDto.createFromEntity(savedUser);
    });
  }

  public async getUserList(): Promise<UserDto[]> {
    const users = await this._entityManager.find(User);
    return users.map((user) => UserDto.createFromEntity(user));
  }

  public async getUserById(id: string): Promise<UserDto> {
    const user = await this._entityManager.findOne(User, {
      where: { user_id: Equal(id) },
    });
    if (!user) throw new NotFoundException(`User ${id} not found`);
    return UserDto.createFromEntity(user);
  }

  public async updateUser(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserDto> {
    const user = await this._entityManager.findOne(User, {
      where: { user_id: Equal(id) },
    });
    if (!user) throw new NotFoundException(`User ${id} not found`);

    Object.assign(user, updateUserDto);
    const updatedUser = await this._entityManager.save(user);
    return UserDto.createFromEntity(updatedUser);
  }

  public async removeUser(id: string): Promise<void> {
    const result = await this._entityManager.delete(User, { user_id: id });
    if (result.affected === 0)
      throw new NotFoundException(`User ${id} not found`);
  }
}
