import {
  HttpStatus,
  Injectable,
  Param,
  ParseIntPipe,
  Provider,
} from '@nestjs/common';
import { Course } from './courses.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course)
    private readonly coursesRepository: Repository<Course>,
  ) {}

  // [GET] http://localhost:3000/courses
  async getAllCourses(): Promise<{
    status: number;
    message: string;
    course?: Partial<Course>[];
  }> {
    const courses = await this.coursesRepository.find();
    if (courses && courses.length > 0) {
      return {
        status: HttpStatus.OK,
        message: 'Lấy dữ liệu thành công',
        course: courses,
      };
    }
    return {
      status: HttpStatus.NOT_FOUND,
      message: 'Lấy dữ liệu không thành  công',
    };
  }

  // [GET] http://localhost:3000/courses/:userId
  async getAllCoursesByUserId(id: number): Promise<{
    status: number;
    message: string;
    course?: Partial<Course>[];
  }> {
    const allCoursesUser = await this.coursesRepository.find({
      where: { instructor: { id: id } },
      // relations: ['instructor'],
    });
    if (!allCoursesUser) {
      return {
        status: HttpStatus.NOT_FOUND,
        message: 'Lấy dữ liệu không thành  công',
      };
    }
    return {
      status: HttpStatus.OK,
      message: 'Lấy dữ liệu  thành  công',
      course: allCoursesUser,
    };
  }
}
