// backend/src/seeder/user.seeder.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from '../users/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserSeeder {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

  async seed() {
    const admin = await this.userRepo.findOne({
      where: { email: 'admin@gmail.com' },
    });
    if (!admin) {
      const hashed = await bcrypt.hash('admin123', 10);
      const newAdmin = this.userRepo.create({
        name: 'Admin',
        email: 'admin@gmail.com',
        password: hashed,
        role: UserRole.ADMIN,
      });
      await this.userRepo.save(newAdmin);
      console.log(
        '✅ Default admin created: email=admin@gmail.com, password=admin123',
      );
    } else {
      console.log('ℹ️ Admin already exists, skip seeding');
    }
  }
}
