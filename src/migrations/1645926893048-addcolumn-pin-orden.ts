import {MigrationInterface, QueryRunner} from "typeorm";

export class addcolumnPinOrden1645926893048 implements MigrationInterface {
    name = 'addcolumnPinOrden1645926893048'

    public async up(queryRunner: QueryRunner): Promise<void> {
        
        await queryRunner.query(`ALTER TABLE \`u763815705_repair\`.\`orden\` ADD \`pin\` int NULL`);
        
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        
        await queryRunner.query(`ALTER TABLE \`u763815705_repair\`.\`orden\` DROP COLUMN \`pin\``);
        
    }

}
