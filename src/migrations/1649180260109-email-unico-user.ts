import {MigrationInterface, QueryRunner} from "typeorm";

export class emailUnicoUser1649180260109 implements MigrationInterface {
    name = 'emailUnicoUser1649180260109'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`u763815705_repair\`.\`seg_usuario\` DROP COLUMN \`email\``);
        await queryRunner.query(`ALTER TABLE \`u763815705_repair\`.\`seg_usuario\` ADD \`email\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`u763815705_repair\`.\`seg_usuario\` ADD UNIQUE INDEX \`IDX_email\` (\`email\`)`);
        
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        
        await queryRunner.query(`ALTER TABLE \`u763815705_repair\`.\`seg_usuario\` DROP INDEX \`IDX_email\``);
        await queryRunner.query(`ALTER TABLE \`u763815705_repair\`.\`seg_usuario\` DROP COLUMN \`email\``);
        await queryRunner.query(`ALTER TABLE \`u763815705_repair\`.\`seg_usuario\` ADD \`email\` varchar(255) NOT NULL`);
        
    }

}
