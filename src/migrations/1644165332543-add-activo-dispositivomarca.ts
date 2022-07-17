import {MigrationInterface, QueryRunner} from "typeorm";

export class addActivoDispositivomarca1644165332543 implements MigrationInterface {
    name = 'addActivoDispositivomarca1644165332543'

    public async up(queryRunner: QueryRunner): Promise<void> {
        
        await queryRunner.query(`ALTER TABLE \`u763815705_repair\`.\`dispositivo_marca\` ADD \`activo\` tinyint NOT NULL DEFAULT '1'`);
       
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        
        await queryRunner.query(`ALTER TABLE \`u763815705_repair\`.\`dispositivo_marca\` DROP COLUMN \`activo\``);
       
    }

}
