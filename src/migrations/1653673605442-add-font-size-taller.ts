import {MigrationInterface, QueryRunner} from "typeorm";

export class addFontSizeTaller1653673605442 implements MigrationInterface {
    name = 'addFontSizeTaller1653673605442'

    public async up(queryRunner: QueryRunner): Promise<void> {
       
        await queryRunner.query(`ALTER TABLE \`u763815705_repair\`.\`taller\` ADD \`font\` varchar(50) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`u763815705_repair\`.\`taller\` ADD \`size\` varchar(5) NOT NULL`);
        
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        
        await queryRunner.query(`ALTER TABLE \`u763815705_repair\`.\`taller\` DROP COLUMN \`size\``);
        await queryRunner.query(`ALTER TABLE \`u763815705_repair\`.\`taller\` DROP COLUMN \`font\``);
        
    }

}
