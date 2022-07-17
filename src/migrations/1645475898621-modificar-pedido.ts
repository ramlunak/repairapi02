import {MigrationInterface, QueryRunner} from "typeorm";

export class modificarPedido1645475898621 implements MigrationInterface {
    name = 'modificarPedido1645475898621'

    public async up(queryRunner: QueryRunner): Promise<void> {
        
        await queryRunner.query(`ALTER TABLE \`u763815705_repair\`.\`pedido\` DROP COLUMN \`pedido\``);
        await queryRunner.query(`ALTER TABLE \`u763815705_repair\`.\`pedido\` ADD \`pedido\` text NOT NULL`);
        
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        
        await queryRunner.query(`ALTER TABLE \`u763815705_repair\`.\`pedido\` DROP COLUMN \`pedido\``);
        await queryRunner.query(`ALTER TABLE \`u763815705_repair\`.\`pedido\` ADD \`pedido\` int NOT NULL`);
        
    }

}
