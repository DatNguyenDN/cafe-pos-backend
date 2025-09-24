import { Controller, Post, Param, Get } from '@nestjs/common';
import { AttendanceService } from './attendance.service';

@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post('checkin/:userId')
  checkIn(@Param('userId') userId: number) {
    return this.attendanceService.checkIn(userId);
  }

  @Post('checkout/:attendanceId')
  checkOut(@Param('attendanceId') attendanceId: number) {
    return this.attendanceService.checkOut(attendanceId);
  }

  @Get('user/:userId')
  getByUser(@Param('userId') userId: number) {
    return this.attendanceService.getByUser(userId);
  }
}
