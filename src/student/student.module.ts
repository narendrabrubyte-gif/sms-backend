import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from './entities/student.entity';
import { StudentService } from './student.service';
import { StudentController } from './student.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Student]), AuthModule],
  
  controllers: [StudentController],
  providers: [StudentService],
})
export class StudentModule {}
