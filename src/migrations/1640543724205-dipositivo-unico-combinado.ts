import {MigrationInterface, QueryRunner} from "typeorm";

export class dipositivoUnicoCombinado1640543724205 implements MigrationInterface {
    name = 'dipositivoUnicoCombinado1640543724205'

    public async up(queryRunner: QueryRunner): Promise<void> {
        
        await queryRunner.query(`DROP INDEX \`IDX_378b774e2095e0a81e6edca7f3\` ON \`u763815705_repair\`.\`dispositivo\``);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_4705219a00887bb501498ff541\` ON \`u763815705_repair\`.\`dispositivo\` (\`dispositivo\`, \`idTaller\`)`);
       
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        
        await queryRunner.query(`DROP INDEX \`IDX_4705219a00887bb501498ff541\` ON \`u763815705_repair\`.\`dispositivo\``);        
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_378b774e2095e0a81e6edca7f3\` ON \`u763815705_repair\`.\`dispositivo\` (\`dispositivo\`)`);
      
    }

}
