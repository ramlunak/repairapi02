import {MigrationInterface, QueryRunner} from "typeorm";

export class marcarCampoUnico1637466251033 implements MigrationInterface {
    name = 'marcarCampoUnico1637466251033'

    public async up(queryRunner: QueryRunner): Promise<void> {
        
        await queryRunner.query(`ALTER TABLE \`u763815705_repair\`.\`marca\` ADD UNIQUE INDEX \`IDX_90b39bf869ef5d882050740587\` (\`marca\`)`);
        
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
       
        await queryRunner.query(`ALTER TABLE \`u763815705_repair\`.\`marca\` DROP INDEX \`IDX_90b39bf869ef5d882050740587\``);
        
    }

}
