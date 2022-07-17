import {MigrationInterface, QueryRunner} from "typeorm";

export class marcaCampoUnico1640447813072 implements MigrationInterface {
    name = 'marcaCampoUnico1640447813072'

    public async up(queryRunner: QueryRunner): Promise<void> {
        
        await queryRunner.query(`ALTER TABLE \`u763815705_repair\`.\`marca\` DROP FOREIGN KEY \`FK_490a5e7c2e97d3d4cace31387ff\``);
        await queryRunner.query(`DROP INDEX \`IDX_90b39bf869ef5d882050740587\` ON \`u763815705_repair\`.\`marca\``);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_4e2dcf9eb8986a22980c8682c3\` ON \`u763815705_repair\`.\`marca\` (\`marca\`, \`idTaller\`)`);
       
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      
        await queryRunner.query(`DROP INDEX \`IDX_4e2dcf9eb8986a22980c8682c3\` ON \`u763815705_repair\`.\`marca\``);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_90b39bf869ef5d882050740587\` ON \`u763815705_repair\`.\`marca\` (\`marca\`)`);
    }

}
