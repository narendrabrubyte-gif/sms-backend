import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  ClassSerializerInterceptor,
  ParseUUIDPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDto } from './dto/user.dto';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('user')
export class UserController {
  constructor(private readonly _userService: UserService) {}

  @Post()
  public async addUser(@Body() createUserDto: CreateUserDto): Promise<UserDto> {
    return await this._userService.createUser(createUserDto);
  }

  @Get()
  public async getUserList(): Promise<UserDto[]> {
    return await this._userService.getUserList();
  }

  @Get(':id')
  public async getUserById(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<UserDto> {
    return await this._userService.getUserById(id);
  }

  @Patch(':id')
  public async updateUserInfo(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserDto> {
    return await this._userService.updateUser(id, updateUserDto);
  }

  @Delete(':id')
  public async deleteUser(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    await this._userService.removeUser(id);
  }
}
