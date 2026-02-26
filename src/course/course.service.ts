import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { Brackets, EntityManager, Equal } from 'typeorm';
import { Course } from './entities/course.entity';
import { CourseDto } from './dto/course.dto';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { Mark } from 'src/marks/entities/mark.entity';
import { Enrollment } from 'src/enrollment/entities/enrollment.entity';

@Injectable()
export class CourseService {
  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {}

  // ✅ CREATE
  public async createCourse(
    createCourseDto: CreateCourseDto,
  ): Promise<CourseDto> {
    const course = this.entityManager.create(Course, createCourseDto);
    const saved = await this.entityManager.save(course);
    return CourseDto.createFromEntity(saved);
  }

  // ✅ LIST
  public async getCourseList(
    search?: string,
    page = 1,
    limit = 10,
  ): Promise<{
    data: CourseDto[];
    meta: { total: number; page: number; limit: number; last_page: number };
  }> {
    const skip = (page - 1) * limit;

    const qb = this.entityManager.createQueryBuilder(Course, 'course');

    if (search) {
      qb.andWhere(
        new Brackets((q) => {
          q.where('course.name LIKE :search', { search: `%${search}%` });
        }),
      );
    }

    qb.orderBy('course.created_at', 'DESC').take(limit).skip(skip);

    const [data, total] = await qb.getManyAndCount();

    return {
      data: data.map(CourseDto.createFromEntity),
      meta: {
        total,
        page,
        limit,
        last_page: Math.ceil(total / limit),
      },
    };
  }

  // ✅ GET BY ID
  public async getCourseById(course_id: string): Promise<CourseDto> {
    const course = await this.entityManager.findOne(Course, {
      where: { course_id: Equal(course_id) },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    return CourseDto.createFromEntity(course);
  }

  // ✅ UPDATE
  public async updateCourse(
    course_id: string,
    updateCourseDto: UpdateCourseDto,
  ): Promise<CourseDto> {
    const course = await this.entityManager.findOne(Course, {
      where: { course_id: Equal(course_id) },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    Object.assign(course, updateCourseDto);
    const updated = await this.entityManager.save(course);

    return CourseDto.createFromEntity(updated);
  }

  // ✅ DELETE (SAFE + FIXED)
  public async deleteCourse(course_id: string): Promise<void> {
    await this.entityManager.transaction(async (manager) => {
      const course = await manager.findOne(Course, {
        where: { course_id },
      });

      if (!course) {
        throw new NotFoundException('Course not found');
      }

      // delete dependencies first
      await manager.delete(Mark, {
        course: { course_id },
      });

      await manager.delete(Enrollment, {
        course: { course_id },
      });

      await manager.delete(Course, { course_id });
    });
  }
}
