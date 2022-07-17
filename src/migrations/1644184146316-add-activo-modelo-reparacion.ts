import {MigrationInterface, QueryRunner} from "typeorm";

export class addActivoModeloReparacion1644184146316 implements MigrationInterface {
    name = 'addActivoModeloReparacion1644184146316'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`u763815705_repair\`.\`modelo_reparacion\` ADD \`activo\` tinyint NOT NULL DEFAULT '1'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`u763815705_repair\`.\`modelo_reparacion\` DROP COLUMN \`activo\``);
    }

}
