import {MigrationInterface, QueryRunner} from "typeorm";

export class addEmailUser1646967041340 implements MigrationInterface {
    name = 'addEmailUser1646967041340'

    public async up(queryRunner: QueryRunner): Promise<void> {
        
        await queryRunner.query(`ALTER TABLE \`u763815705_repair\`.\`seg_usuario\` ADD \`email\` varchar(255) NOT NULL`);
        
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        
        await queryRunner.query(`ALTER TABLE \`u763815705_repair\`.\`seg_usuario\` DROP COLUMN \`email\``);
        
    }

}
