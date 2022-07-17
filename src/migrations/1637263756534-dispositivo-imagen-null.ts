import {MigrationInterface, QueryRunner} from "typeorm";

export class dispositivoImagenNull1637263756534 implements MigrationInterface {
    name = 'dispositivoImagenNull1637263756534'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`u763815705_repair\`.\`dispositivo\` CHANGE \`imagen\` \`imagen\` text NULL`);
        
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`u763815705_repair\`.\`dispositivo\` CHANGE \`imagen\` \`imagen\` text NOT NULL`);
        
    }

}
