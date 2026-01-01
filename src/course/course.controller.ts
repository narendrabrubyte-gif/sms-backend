import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';
import { CourseService } from './course.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { CourseDto } from './dto/course.dto';

@UseGuards(AuthGuard)
@Controller('courses')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Post()
  public async addCourse(
    @Body() CreateCourseDto: CreateCourseDto,
  ): Promise<CourseDto> {
    return await this.courseService.createCourse(CreateCourseDto);
  }

  @Get()
  public async getCourseList(
    @Query('search') search?: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page?: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit?: number,
  ): Promise<{
    data: CourseDto[];
    meta: { total: number; page: number; limit: number; last_page: number };
  }> {
    return await this.courseService.getCourseList(
      search,
      Number(page),
      Number(limit),
    );
  }

  @Get(':id')
  public async getCourseById(@Param('id') id: string): Promise<CourseDto> {
    return await this.courseService.getCourseById(id);
  }

  @Patch(':id')
  public async updateCourseInfo(
    @Param('id') id: string,
    @Body() updateCourseDto: UpdateCourseDto,
  ): Promise<CourseDto> {
    return await this.courseService.updateCourse(id, updateCourseDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async removeCourse(@Param('id', ParseUUIDPipe) id: string) {
    return await this.courseService.deleteCourse(id);
  }
}
