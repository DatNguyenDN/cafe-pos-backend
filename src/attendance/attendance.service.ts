import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Attendance } from './attendance.entity';
import { User } from '../users/user.entity';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(Attendance)
    private attendanceRepo: Repository<Attendance>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async checkIn(userId: number): Promise<Attendance> {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new Error('User not found');

    const attendance = this.attendanceRepo.create({ user });
    return this.attendanceRepo.save(attendance);
  }

  async checkOut(attendanceId: number): Promise<Attendance> {
    const attendance = await this.attendanceRepo.findOne({
      where: { id: attendanceId },
      relations: ['user'],
    });
    if (!attendance) throw new Error('Attendance not found');

    attendance.checkOut = new Date();
    return this.attendanceRepo.save(attendance);
  }

  async getByUser(userId: number): Promise<Attendance[]> {
    return this.attendanceRepo.find({
      where: { user: { id: userId } },
      relations: ['user'],
    });
  }
}
