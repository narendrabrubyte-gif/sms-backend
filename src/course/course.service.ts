import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from './entities/course.entity';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(Course)
    private courseRepository: Repository<Course>,
  ) {}

  async create(createCourseDto: CreateCourseDto): Promise<Course> {
    const course = this.courseRepository.create(createCourseDto);
    return this.courseRepository.save(course);
  }

  async findAll(search?: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    // Query Builder start karein
    const query = this.courseRepository.createQueryBuilder('course');

    if (search) {
      query.andWhere('(course.name LIKE :search)', { search: `%${search}%` });
    }
    query.skip(skip).take(limit);
    const [data, total] = await query.getManyAndCount();

    return {
      data,
      meta: {
        total,
        page,
        limit,
        last_page: Math.ceil(total / limit),
      },
    };
  }
  async findOne(course_id: string) {
    const course = await this.courseRepository.findOne({
      where: { course_id: course_id },
    });
    if (!course) {
      throw new NotFoundException(`Course with ID ${course_id} not found`);
    }
    return course;
  }
  async update(course_id: string, updateCourseDto: UpdateCourseDto) {
    const course = await this.findOne(course_id);
    Object.assign(course, updateCourseDto);
    return await this.courseRepository.save(course);
  }

  async remove(course_id: string) {
    const course = await this.findOne(course_id);
    if (!course) {
      throw new NotFoundException(`Course with ID ${course_id} not found`);
    }
    await this.courseRepository.remove(course);
  }
}
