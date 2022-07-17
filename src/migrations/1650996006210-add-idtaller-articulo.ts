import {MigrationInterface, QueryRunner} from "typeorm";

export class addIdtallerArticulo1650996006210 implements MigrationInterface {
    name = 'addIdtallerArticulo1650996006210'

    public async up(queryRunner: QueryRunner): Promise<void> {
        
        await queryRunner.query(`ALTER TABLE \`u763815705_repair\`.\`articulo\` ADD \`idTaller\` int NOT NULL`);
        
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        
        await queryRunner.query(`ALTER TABLE \`u763815705_repair\`.\`articulo\` DROP COLUMN \`idTaller\``);
        
    }

}
