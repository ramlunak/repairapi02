import {MigrationInterface, QueryRunner} from "typeorm";

export class addNombreArticulo1650995467669 implements MigrationInterface {
    name = 'addNombreArticulo1650995467669'

    public async up(queryRunner: QueryRunner): Promise<void> {
        
        await queryRunner.query(`ALTER TABLE \`u763815705_repair\`.\`articulo\` ADD \`nombre\` varchar(50) NOT NULL`);
        
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        
        await queryRunner.query(`ALTER TABLE \`u763815705_repair\`.\`articulo\` DROP COLUMN \`nombre\``);
        
    }

}
