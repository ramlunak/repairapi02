import {MigrationInterface, QueryRunner} from "typeorm";

export class addPrecioVenta1653334864865 implements MigrationInterface {
    name = 'addPrecioVenta1653334864865'

    public async up(queryRunner: QueryRunner): Promise<void> {
        
        await queryRunner.query(`ALTER TABLE \`u763815705_repair\`.\`venta\` ADD \`precioVentaFinal\` decimal(9,2) NULL`);
        
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        
        await queryRunner.query(`ALTER TABLE \`u763815705_repair\`.\`venta\` DROP COLUMN \`precioVentaFinal\``);
        
    }

}
