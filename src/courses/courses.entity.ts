import { User } from 'src/users/users.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';

@Entity('courses')
export class Course {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @ManyToOne(() => User, (user) => user.courses, { onDelete: 'CASCADE' })
  instructor: User;

  @CreateDateColumn()
  created_at: Date;

  @Column({ type: 'enum', enum: ['active', 'unactive'] })
  role: 'active' | 'unactive';
}
