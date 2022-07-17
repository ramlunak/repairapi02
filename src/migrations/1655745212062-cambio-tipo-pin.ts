import {MigrationInterface, QueryRunner} from "typeorm";

export class cambioTipoPin1655745212062 implements MigrationInterface {
    name = 'cambioTipoPin1655745212062'

    public async up(queryRunner: QueryRunner): Promise<void> {
        
        await queryRunner.query(`ALTER TABLE \`u763815705_repair\`.\`orden\` DROP COLUMN \`pin\``);
        await queryRunner.query(`ALTER TABLE \`u763815705_repair\`.\`orden\` ADD \`pin\` varchar(50) NULL`);
        
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        
        await queryRunner.query(`ALTER TABLE \`u763815705_repair\`.\`orden\` DROP COLUMN \`pin\``);
        await queryRunner.query(`ALTER TABLE \`u763815705_repair\`.\`orden\` ADD \`pin\` int NULL`);
        
    }

}
