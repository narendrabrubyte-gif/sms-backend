import { Controller, Post, Body, UseGuards, Get, Param } from '@nestjs/common';
import { MarksService } from './marks.service';
import { CreateMarkDto } from './dto/create-mark.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('marks')
export class MarksController {
  constructor(private readonly marksService: MarksService) {}

  @Post()
  public async assignMarks(@Body() createMarkDto: CreateMarkDto) {
    return await this.marksService.addMarks(createMarkDto);
  }

  @Get('student/:student_id')
  public async findByStudent(@Param('student_id') student_id: string) {
    return await this.marksService.findByStudent(student_id);
  }

  @Get('course/:course_id')
  public async findByCourse(@Param('course_id') course_id: string) {
    return await this.marksService.findByCourse(course_id);
  }
}
