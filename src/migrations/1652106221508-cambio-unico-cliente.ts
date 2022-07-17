import {MigrationInterface, QueryRunner} from "typeorm";

export class cambioUnicoCliente1652106221508 implements MigrationInterface {
    name = 'cambioUnicoCliente1652106221508'

    public async up(queryRunner: QueryRunner): Promise<void> {
        
        await queryRunner.query(`DROP INDEX \`IDX_9935842e3b6d6ac472cac5916b\` ON \`u763815705_repair\`.\`cliente\``);
        
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_9271b0f097369dc562fb39ce6a\` ON \`u763815705_repair\`.\`cliente\` (\`telefono\`, \`idTaller\`)`);
        
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        
        await queryRunner.query(`DROP INDEX \`IDX_9271b0f097369dc562fb39ce6a\` ON \`u763815705_repair\`.\`cliente\``);
        
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_9935842e3b6d6ac472cac5916b\` ON \`u763815705_repair\`.\`cliente\` (\`telefono\`)`);
        
    }

}
