import {MigrationInterface, QueryRunner} from "typeorm";

export class addTelefonoTaller1654608896615 implements MigrationInterface {
    name = 'addTelefonoTaller1654608896615'

    public async up(queryRunner: QueryRunner): Promise<void> {
        
        await queryRunner.query(`ALTER TABLE \`u763815705_repair\`.\`taller\` ADD \`telefono1\` varchar(50) NULL`);
        await queryRunner.query(`ALTER TABLE \`u763815705_repair\`.\`taller\` ADD \`telefono2\` varchar(50) NULL`);
        await queryRunner.query(`ALTER TABLE \`u763815705_repair\`.\`taller\` ADD \`nif\` varchar(50) NULL`);
        
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        
        await queryRunner.query(`ALTER TABLE \`u763815705_repair\`.\`taller\` DROP COLUMN \`nif\``);
        await queryRunner.query(`ALTER TABLE \`u763815705_repair\`.\`taller\` DROP COLUMN \`telefono2\``);
        await queryRunner.query(`ALTER TABLE \`u763815705_repair\`.\`taller\` DROP COLUMN \`telefono1\``);
        
    }

}
