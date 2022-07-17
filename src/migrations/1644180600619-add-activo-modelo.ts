import {MigrationInterface, QueryRunner} from "typeorm";

export class addActivoModelo1644180600619 implements MigrationInterface {
    name = 'addActivoModelo1644180600619'

    public async up(queryRunner: QueryRunner): Promise<void> {
       
        await queryRunner.query(`ALTER TABLE \`u763815705_repair\`.\`modelo\` ADD \`activo\` tinyint NOT NULL DEFAULT '1'`);
      
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        
        await queryRunner.query(`ALTER TABLE \`u763815705_repair\`.\`modelo\` DROP COLUMN \`activo\``);
       
    }

}
