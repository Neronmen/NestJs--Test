import { Course } from 'src/courses/courses.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  name: string;

  @Column({ unique: true, length: 255 })
  email: string;

  @Column({ length: 255 })
  password: string;

  @Column({ type: 'enum', enum: ['student', 'instructor'] })
  role: 'student' | 'instructor';

  @CreateDateColumn()
  created_at: Date;

  @Column({ length: 36 })
  token: string;

  @OneToMany(() => Course, (course) => course.instructor)
  courses: Course[];
}
