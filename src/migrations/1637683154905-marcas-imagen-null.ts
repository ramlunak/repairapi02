import {MigrationInterface, QueryRunner} from "typeorm";

export class marcasImagenNull1637683154905 implements MigrationInterface {
    name = 'marcasImagenNull1637683154905'

    public async up(queryRunner: QueryRunner): Promise<void> {
        
        await queryRunner.query(`ALTER TABLE \`u763815705_repair\`.\`marca\` CHANGE \`imagen\` \`imagen\` text NULL`);
        
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        
        await queryRunner.query(`ALTER TABLE \`u763815705_repair\`.\`marca\` CHANGE \`imagen\` \`imagen\` text NOT NULL`);
        
    }

}
