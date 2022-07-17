import {MigrationInterface, QueryRunner} from "typeorm";

export class modificarImagenReparacion1645198621743 implements MigrationInterface {
    name = 'modificarImagenReparacion1645198621743'

    public async up(queryRunner: QueryRunner): Promise<void> {
        
        await queryRunner.query(`ALTER TABLE \`u763815705_repair\`.\`reparacion\` CHANGE \`imagen\` \`imagen\` text NULL`);
        
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        
        await queryRunner.query(`ALTER TABLE \`u763815705_repair\`.\`reparacion\` CHANGE \`imagen\` \`imagen\` text NOT NULL`);
        
    }

}
