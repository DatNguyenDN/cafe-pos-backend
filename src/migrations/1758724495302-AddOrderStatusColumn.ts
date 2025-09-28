import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddOrderStatusColumn1695820000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'orders',
      new TableColumn({
        name: 'status',
        type: 'enum',
        enum: ['PENDING', 'PAID', 'CANCELLED'],
        default: "'PENDING'",
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('orders', 'status');
    await queryRunner.query(`DROP TYPE IF EXISTS "orders_status_enum"`);
  }
}
