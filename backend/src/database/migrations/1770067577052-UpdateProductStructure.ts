import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateProductStructure1770067577052 implements MigrationInterface {
    name = 'UpdateProductStructure1770067577052'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_variants" RENAME COLUMN "sku" TO "product_id"`);
        await queryRunner.query(`ALTER TABLE "product_variants" RENAME CONSTRAINT "UQ_46f236f21640f9da218a063a866" TO "UQ_6343513e20e2deab45edfce1316"`);
        await queryRunner.query(`CREATE TABLE "product_categories" ("product_id" uuid NOT NULL, "category_id" uuid NOT NULL, CONSTRAINT "PK_54f2e1dbf14cfa770f59f0aac8f" PRIMARY KEY ("product_id", "category_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_8748b4a0e8de6d266f2bbc877f" ON "product_categories" ("product_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_9148da8f26fc248e77a387e311" ON "product_categories" ("category_id") `);
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "categoryId"`);
        await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "UQ_c44ac33a05b144dd0d9ddcf9327"`);
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "sku"`);
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "metal"`);
        await queryRunner.query(`CREATE TYPE "public"."products_material_enum" AS ENUM('silver_925', 'gold_585', 'gold_750', 'platinum', 'steel')`);
        await queryRunner.query(`ALTER TABLE "products" ADD "material" "public"."products_material_enum" NOT NULL DEFAULT 'steel'`);
        await queryRunner.query(`ALTER TABLE "products" ADD "images" jsonb NOT NULL DEFAULT '[]'`);
        await queryRunner.query(`ALTER TABLE "product_variants" DROP CONSTRAINT "UQ_6343513e20e2deab45edfce1316"`);
        await queryRunner.query(`ALTER TABLE "product_variants" DROP COLUMN "product_id"`);
        await queryRunner.query(`ALTER TABLE "product_variants" ADD "product_id" uuid`);
        await queryRunner.query(`ALTER TABLE "product_variants" ADD CONSTRAINT "FK_6343513e20e2deab45edfce1316" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_categories" ADD CONSTRAINT "FK_8748b4a0e8de6d266f2bbc877f6" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "product_categories" ADD CONSTRAINT "FK_9148da8f26fc248e77a387e3112" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_categories" DROP CONSTRAINT "FK_9148da8f26fc248e77a387e3112"`);
        await queryRunner.query(`ALTER TABLE "product_categories" DROP CONSTRAINT "FK_8748b4a0e8de6d266f2bbc877f6"`);
        await queryRunner.query(`ALTER TABLE "product_variants" DROP CONSTRAINT "FK_6343513e20e2deab45edfce1316"`);
        await queryRunner.query(`ALTER TABLE "product_variants" DROP COLUMN "product_id"`);
        await queryRunner.query(`ALTER TABLE "product_variants" ADD "product_id" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "product_variants" ADD CONSTRAINT "UQ_6343513e20e2deab45edfce1316" UNIQUE ("product_id")`);
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "images"`);
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "material"`);
        await queryRunner.query(`DROP TYPE "public"."products_material_enum"`);
        await queryRunner.query(`ALTER TABLE "products" ADD "metal" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "products" ADD "sku" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "products" ADD CONSTRAINT "UQ_c44ac33a05b144dd0d9ddcf9327" UNIQUE ("sku")`);
        await queryRunner.query(`ALTER TABLE "products" ADD "categoryId" character varying NOT NULL`);
        await queryRunner.query(`DROP INDEX "public"."IDX_9148da8f26fc248e77a387e311"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_8748b4a0e8de6d266f2bbc877f"`);
        await queryRunner.query(`DROP TABLE "product_categories"`);
        await queryRunner.query(`ALTER TABLE "product_variants" RENAME CONSTRAINT "UQ_6343513e20e2deab45edfce1316" TO "UQ_46f236f21640f9da218a063a866"`);
        await queryRunner.query(`ALTER TABLE "product_variants" RENAME COLUMN "product_id" TO "sku"`);
    }

}
