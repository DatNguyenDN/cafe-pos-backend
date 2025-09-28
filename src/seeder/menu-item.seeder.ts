// backend/src/seeder/menu-item.seeder.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MenuItem } from '../menu/menu-item.entity';

@Injectable()
export class MenuItemSeeder {
  constructor(
    @InjectRepository(MenuItem) private menuRepo: Repository<MenuItem>,
  ) {}

  async seed() {
    const count = await this.menuRepo.count();
    if (count > 0) return;

    const items: Partial<MenuItem>[] = [
      // Cà phê
      { name: 'Cà phê sữa', price: 25000, category: 'Cà phê' },
      { name: 'Cà phê đen', price: 20000, category: 'Cà phê' },
      { name: 'Cà phê cold brew', price: 50000, category: 'Cà phê' },
      { name: 'Bạc xỉu', price: 50000, category: 'Cà phê' },

      // Trà
      { name: 'Trà đào', price: 30000, category: 'Trà' },
      { name: 'Trà chanh', price: 25000, category: 'Trà' },
      { name: 'Trà xanh', price: 28000, category: 'Trà' },
      { name: 'Trà lài', price: 28000, category: 'Trà' },
      { name: 'Trà oolong', price: 35000, category: 'Trà' },
      { name: 'Trà hoa cúc', price: 30000, category: 'Trà' },

      // Trà sữa
      { name: 'Trà sữa trân châu', price: 40000, category: 'Trà sữa' },
      { name: 'Trà sữa matcha', price: 42000, category: 'Trà sữa' },
      { name: 'Trà sữa socola', price: 42000, category: 'Trà sữa' },
      { name: 'Trà sữa thái', price: 40000, category: 'Trà sữa' },
      { name: 'Trà sữa hạt dẻ', price: 45000, category: 'Trà sữa' },
      { name: 'Trà sữa dâu', price: 42000, category: 'Trà sữa' },

      // Topping
      { name: 'Trà sữa trân châu', price: 40000, category: 'Trà sữa' },
      { name: 'Trà sữa matcha', price: 42000, category: 'Trà sữa' },
      { name: 'Trà sữa socola', price: 42000, category: 'Trà sữa' },
      { name: 'Trà sữa thái', price: 40000, category: 'Trà sữa' },
      { name: 'Trà sữa hạt dẻ', price: 45000, category: 'Trà sữa' },
      { name: 'Trà sữa dâu', price: 42000, category: 'Trà sữa' },


      // Sinh tố
      { name: 'Sinh tố bơ', price: 35000, category: 'Sinh tố' },
      { name: 'Sinh tố dâu', price: 35000, category: 'Sinh tố' },
      { name: 'Sinh tố xoài', price: 35000, category: 'Sinh tố' },
      { name: 'Sinh tố việt quất', price: 38000, category: 'Sinh tố' },
      { name: 'Sinh tố kiwi', price: 38000, category: 'Sinh tố' },
      { name: 'Sinh tố cam', price: 32000, category: 'Sinh tố' },

      // Nước ép
      { name: 'Nước cam ép', price: 30000, category: 'Nước ép' },
      { name: 'Nước táo ép', price: 30000, category: 'Nước ép' },
      { name: 'Nước dứa ép', price: 32000, category: 'Nước ép' },
      { name: 'Nước cà rốt ép', price: 30000, category: 'Nước ép' },
      { name: 'Nước lựu ép', price: 35000, category: 'Nước ép' },
      { name: 'Nước dưa hấu ép', price: 30000, category: 'Nước ép' },

      // Bánh ngọt
      { name: 'Bánh ngọt tiramisu', price: 45000, category: 'Bánh ngọt' },
      { name: 'Bánh flan', price: 20000, category: 'Bánh ngọt' },
      { name: 'Bánh mousse socola', price: 50000, category: 'Bánh ngọt' },
      { name: 'Bánh bông lan', price: 40000, category: 'Bánh ngọt' },
      { name: 'Bánh tart trái cây', price: 45000, category: 'Bánh ngọt' },
      { name: 'Bánh cheesecake', price: 50000, category: 'Bánh ngọt' },
      { name: 'Bánh macaron', price: 35000, category: 'Bánh ngọt' },

      // Thêm món khác
      { name: 'Yogurt trái cây', price: 30000, category: 'Khác' },
      { name: 'Choco lava', price: 45000, category: 'Khác' },
      { name: 'Sữa chua mít', price: 30000, category: 'Khác' },
      { name: 'Pudding socola', price: 35000, category: 'Khác' },
      { name: 'Sữa tươi trân châu đường đen', price: 40000, category: 'Khác' },
      { name: 'Mochi', price: 30000, category: 'Khác' },
      { name: 'Bánh crepe', price: 35000, category: 'Khác' },
      { name: 'Kem dừa', price: 40000, category: 'Khác' },
      { name: 'Kem matcha', price: 40000, category: 'Khác' },
      { name: 'Bingsu trái cây', price: 50000, category: 'Khác' },
    ];

    for (const item of items) {
      const menuItem = this.menuRepo.create(item);
      await this.menuRepo.save(menuItem);
    }

    console.log('✅ Seed menu items done');
  }
}
