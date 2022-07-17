import {MigrationInterface, QueryRunner} from "typeorm";

export class CambiarTipoImagen1636402953685 implements MigrationInterface {
    name = 'CambiarTipoImagen1636402953685'

    public async up(queryRunner: QueryRunner): Promise<void> {
      
       
        await queryRunner.query(`ALTER TABLE \`u763815705_repair\`.\`dispositivo\` DROP COLUMN \`imagen\``);
        await queryRunner.query(`ALTER TABLE \`u763815705_repair\`.\`dispositivo\` ADD \`imagen\` text NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`u763815705_repair\`.\`marca\` DROP COLUMN \`imagen\``);
        await queryRunner.query(`ALTER TABLE \`u763815705_repair\`.\`marca\` ADD \`imagen\` text NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`u763815705_repair\`.\`taller\` DROP COLUMN \`logo\``);
        await queryRunner.query(`ALTER TABLE \`u763815705_repair\`.\`taller\` ADD \`logo\` text NOT NULL`);
        
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        
        await queryRunner.query(`ALTER TABLE \`u763815705_repair\`.\`taller\` DROP COLUMN \`logo\``);
        await queryRunner.query(`ALTER TABLE \`u763815705_repair\`.\`taller\` ADD \`logo\` blob NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`u763815705_repair\`.\`marca\` DROP COLUMN \`imagen\``);
        await queryRunner.query(`ALTER TABLE \`u763815705_repair\`.\`marca\` ADD \`imagen\` blob NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`u763815705_repair\`.\`dispositivo\` DROP COLUMN \`imagen\``);
        await queryRunner.query(`ALTER TABLE \`u763815705_repair\`.\`dispositivo\` ADD \`imagen\` blob NOT NULL`);
       
    }

}
