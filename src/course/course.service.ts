import { Injectable, NotFoundException } from '@nestjs/common';

import { InjectEntityManager } from '@nestjs/typeorm';
import { Brackets, EntityManager } from 'typeorm';
import { CourseDto } from './dto/course.dto';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { Course } from './entities/course.entity';

@Injectable()
export class CourseService {
  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {}

  public async createCourse(
    createCourseDto: CreateCourseDto,
  ): Promise<CourseDto> {
    const course = this.entityManager.create(Course, createCourseDto);
    return await this.entityManager.save(course);
  }

  public async getCourseList(
    search?: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<{
    data: CourseDto[];
    meta: { total: number; page: number; limit: number; last_page: number };
  }> {
    const skip = (page - 1) * limit;

    const whereClause = this.entityManager.createQueryBuilder(Course, 'course');

    if (search) {
      whereClause.andWhere(
        new Brackets((whereClause) => {
          whereClause.andWhere('course.name LIKE :search');
        }),
        { search: `%${search}%` },
      );
    }

    whereClause.orderBy('course.created_at', 'DESC').take(limit).skip(skip);

    const [course, total]: [Course[], number] =
      await whereClause.getManyAndCount();

    return {
      data: course.map((course: Course) => CourseDto.createFromEntity(course)),
      meta: {
        total,
        limit,
        page,
        last_page: Math.ceil(total / limit),
      },
    };
  }

  public async getCourseById(course_id: string): Promise<CourseDto> {
    const course = await this.entityManager.findOne(Course, {
      where: { course_id: course_id },
    });
    if (!course) {
      throw new NotFoundException(`Course with ID ${course_id} not found`);
    }
    return course;
  }
  public async updateCourse(
    course_id: string,
    updateCourseDto: UpdateCourseDto,
  ): Promise<CourseDto> {
    const course = await this.getCourseById(course_id);
    Object.assign(course, updateCourseDto);
    return await this.entityManager.save(course);
  }

  public async deleteCourse(course_id: string): Promise<void> {
    const course = await this.getCourseById(course_id);
    if (!course) {
      throw new NotFoundException(`Course with ID ${course_id} not found`);
    }
    await this.entityManager.remove(course);
  }
}
