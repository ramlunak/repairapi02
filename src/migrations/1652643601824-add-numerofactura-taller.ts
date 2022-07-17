import {MigrationInterface, QueryRunner} from "typeorm";

export class addNumerofacturaTaller1652643601824 implements MigrationInterface {
    name = 'addNumerofacturaTaller1652643601824'

    public async up(queryRunner: QueryRunner): Promise<void> {
        
        await queryRunner.query(`ALTER TABLE \`u763815705_repair\`.\`taller\` ADD \`numero_factura\` int NOT NULL DEFAULT '1'`);
        
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        
        await queryRunner.query(`ALTER TABLE \`u763815705_repair\`.\`taller\` DROP COLUMN \`numero_factura\``);
        
    }

}
