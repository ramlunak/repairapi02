import {MigrationInterface, QueryRunner} from "typeorm";

export class addIvaTaller1649082988076 implements MigrationInterface {
    name = 'addIvaTaller1649082988076'

    public async up(queryRunner: QueryRunner): Promise<void> {
        
        await queryRunner.query(`ALTER TABLE \`u763815705_repair\`.\`taller\` ADD \`iva\` decimal NOT NULL`);
        
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        
        await queryRunner.query(`ALTER TABLE \`u763815705_repair\`.\`taller\` DROP COLUMN \`iva\``);
        
    }

}
