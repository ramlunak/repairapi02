import {MigrationInterface, QueryRunner} from "typeorm";

export class addComentarioOrden1651761099169 implements MigrationInterface {
    name = 'addComentarioOrden1651761099169'

    public async up(queryRunner: QueryRunner): Promise<void> {
        
        await queryRunner.query(`ALTER TABLE \`u763815705_repair\`.\`orden\` ADD \`comentario\` text NULL`);
        
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        
        await queryRunner.query(`ALTER TABLE \`u763815705_repair\`.\`orden\` DROP COLUMN \`comentario\``);
        
    }

}
