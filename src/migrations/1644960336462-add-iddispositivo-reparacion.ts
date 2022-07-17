import {MigrationInterface, QueryRunner} from "typeorm";

export class addIddispositivoReparacion1644960336462 implements MigrationInterface {
    name = 'addIddispositivoReparacion1644960336462'

    public async up(queryRunner: QueryRunner): Promise<void> {
        
        await queryRunner.query(`ALTER TABLE \`u763815705_repair\`.\`reparacion\` ADD \`idDispositivo\` int NOT NULL`);
        
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        
        await queryRunner.query(`ALTER TABLE \`u763815705_repair\`.\`reparacion\` DROP COLUMN \`idDispositivo\``);
        
    }

}
