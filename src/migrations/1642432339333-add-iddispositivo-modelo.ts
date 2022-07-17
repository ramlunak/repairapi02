import {MigrationInterface, QueryRunner} from "typeorm";

export class addIddispositivoModelo1642432339333 implements MigrationInterface {
    name = 'addIddispositivoModelo1642432339333'

    public async up(queryRunner: QueryRunner): Promise<void> {
        
        await queryRunner.query(`ALTER TABLE \`u763815705_repair\`.\`modelo\` ADD \`idDispositivo\` int NULL`);
       
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        
        await queryRunner.query(`ALTER TABLE \`u763815705_repair\`.\`modelo\` DROP COLUMN \`idDispositivo\``);
        
    }

}
