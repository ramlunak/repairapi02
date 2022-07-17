import {MigrationInterface, QueryRunner} from "typeorm";

export class camposUnicos1637838883257 implements MigrationInterface {
    name = 'camposUnicos1637838883257'

    public async up(queryRunner: QueryRunner): Promise<void> {
       
        await queryRunner.query(`ALTER TABLE \`u763815705_repair\`.\`dispositivo\` ADD UNIQUE INDEX \`IDX_378b774e2095e0a81e6edca7f3\` (\`dispositivo\`)`);
       
        await queryRunner.query(`ALTER TABLE \`u763815705_repair\`.\`modelo\` ADD UNIQUE INDEX \`IDX_c96a2d22f385bc64cbccd4199f\` (\`modelo\`)`);
       
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        
        
        await queryRunner.query(`ALTER TABLE \`u763815705_repair\`.\`modelo\` DROP INDEX \`IDX_c96a2d22f385bc64cbccd4199f\``);
       
        await queryRunner.query(`ALTER TABLE \`u763815705_repair\`.\`dispositivo\` DROP INDEX \`IDX_378b774e2095e0a81e6edca7f3\``);
       
    }

}
