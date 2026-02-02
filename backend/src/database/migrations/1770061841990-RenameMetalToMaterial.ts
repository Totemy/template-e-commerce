import { MigrationInterface, QueryRunner } from 'typeorm'

export class RenameMetalToMaterial1700000000000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
      ALTER TABLE products
      RENAME COLUMN metal TO material
    `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
      ALTER TABLE products
      RENAME COLUMN material TO metal
    `)
    }
}
