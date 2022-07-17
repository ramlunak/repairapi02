import {MigrationInterface, QueryRunner} from "typeorm";

export class addActivoDispositivo1644032488436 implements MigrationInterface {
    name = 'addActivoDispositivo1644032488436'

    public async up(queryRunner: QueryRunner): Promise<void> {
        
        await queryRunner.query(`ALTER TABLE \`u763815705_repair\`.\`dispositivo\` ADD \`activo\` tinyint NOT NULL`);
        
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        
        await queryRunner.query(`ALTER TABLE \`u763815705_repair\`.\`dispositivo\` DROP COLUMN \`activo\``);
      
    }

}
