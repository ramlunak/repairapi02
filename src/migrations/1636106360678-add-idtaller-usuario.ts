import {MigrationInterface, QueryRunner} from "typeorm";

export class addIdtallerUsuario1636106360678 implements MigrationInterface {
    name = 'addIdtallerUsuario1636106360678'

    public async up(queryRunner: QueryRunner): Promise<void> {
        
        await queryRunner.query(`ALTER TABLE \`u763815705_repair\`.\`seg_usuario\` ADD \`idTaller\` int NULL`);
        
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        
        await queryRunner.query(`ALTER TABLE \`u763815705_repair\`.\`seg_usuario\` DROP COLUMN \`idTaller\``);
       
    }

}
