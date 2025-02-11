import { Controller, Get, Param, ParseIntPipe, Req, Res } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { Course } from './courses.entity';
import { User } from 'src/users/users.entity';

interface AuthRequest extends Request {
  user?: User;
}

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  // [GET] http://localhost:3000/courses
  @Get() async getAllCoursesController(@Req() req: AuthRequest): Promise<{
    status: number;
    message: string;
    course?: Partial<Course>[];
  }> {
    return await this.coursesService.getAllCourses();
  }

  // [GET] http://localhost:3000/courses/:userId
  @Get(':id')
  async getAllCoursesByUserId(@Param('id', ParseIntPipe) id: number) {
    return this.coursesService.getAllCoursesByUserId(id);
  }
}
