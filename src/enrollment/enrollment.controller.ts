import {
  Controller,
  Get,
  Post,
  UseGuards,
  Body,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';
import { EnrollmentService } from './enrollment.service';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('enrollments')
export class EnrollmentController {
  constructor(private readonly enrollmentService: EnrollmentService) {}

  @Post()
  public async addEnrollment(@Body() createEnrollmentDto: CreateEnrollmentDto) {
    return await this.enrollmentService.addEnrollment(createEnrollmentDto);
  }

  @Get('students/:student_id')
  public async getStudentCourses(
    @Param('student_id', ParseUUIDPipe) student_id: string,
  ) {
    return await this.enrollmentService.getStudentCourses(student_id);
  }

  @Get('courses/:course_id')
  public async getCourseStudents(
    @Param('course_id', ParseUUIDPipe) course_id: string,
  ) {
    return await this.enrollmentService.getCourseStudents(course_id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async deleteEnrollment(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    await this.enrollmentService.deleteEnrollment(id);
  }
}
