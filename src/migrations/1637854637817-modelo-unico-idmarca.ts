import {MigrationInterface, QueryRunner} from "typeorm";

export class modeloUnicoIdmarca1637854637817 implements MigrationInterface {
    name = 'modeloUnicoIdmarca1637854637817'

    public async up(queryRunner: QueryRunner): Promise<void> {
        
        
        
        await queryRunner.query(`DROP INDEX \`IDX_c96a2d22f385bc64cbccd4199f\` ON \`u763815705_repair\`.\`modelo\``);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_986d66d7701a980032a0c9ca2a\` ON \`u763815705_repair\`.\`modelo\` (\`modelo\`, \`idMarca\`)`);
        
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        
        await queryRunner.query(`DROP INDEX \`IDX_986d66d7701a980032a0c9ca2a\` ON \`u763815705_repair\`.\`modelo\``);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_c96a2d22f385bc64cbccd4199f\` ON \`u763815705_repair\`.\`modelo\` (\`modelo\`)`);
           
    }

}
