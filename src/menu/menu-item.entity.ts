import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('menu_items')
export class MenuItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column({ nullable: true })
  category: string;

  @Column({ default: true })
  available: boolean;

  @Column({ nullable: true })
  imageUrl: string; // thêm trường imageUrl
}
