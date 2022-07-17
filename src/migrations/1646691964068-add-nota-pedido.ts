import {MigrationInterface, QueryRunner} from "typeorm";

export class addNotaPedido1646691964068 implements MigrationInterface {
    name = 'addNotaPedido1646691964068'

    public async up(queryRunner: QueryRunner): Promise<void> {
        
        await queryRunner.query(`ALTER TABLE \`u763815705_repair\`.\`pedido\` ADD \`nota\` text NULL`);
        
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        
        await queryRunner.query(`ALTER TABLE \`u763815705_repair\`.\`pedido\` DROP COLUMN \`nota\``);
        
    }

}
