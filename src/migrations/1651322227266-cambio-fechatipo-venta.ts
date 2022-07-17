import {MigrationInterface, QueryRunner} from "typeorm";

export class cambioFechatipoVenta1651322227266 implements MigrationInterface {
    name = 'cambioFechatipoVenta1651322227266'

    public async up(queryRunner: QueryRunner): Promise<void> {
        
        await queryRunner.query(`ALTER TABLE \`u763815705_repair\`.\`venta\` DROP COLUMN \`created_at\``);
        await queryRunner.query(`ALTER TABLE \`u763815705_repair\`.\`venta\` ADD \`created_at\` date NOT NULL`);
        
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        
        await queryRunner.query(`ALTER TABLE \`u763815705_repair\`.\`venta\` DROP COLUMN \`created_at\``);
        await queryRunner.query(`ALTER TABLE \`u763815705_repair\`.\`venta\` ADD \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        
    }

}
