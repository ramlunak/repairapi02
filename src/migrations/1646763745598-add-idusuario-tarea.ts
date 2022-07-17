import {MigrationInterface, QueryRunner} from "typeorm";

export class addIdusuarioTarea1646763745598 implements MigrationInterface {
    name = 'addIdusuarioTarea1646763745598'

    public async up(queryRunner: QueryRunner): Promise<void> {
        
        await queryRunner.query(`ALTER TABLE \`u763815705_repair\`.\`tarea\` ADD \`idUsuario\` int NOT NULL`);
        
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        
        await queryRunner.query(`ALTER TABLE \`u763815705_repair\`.\`tarea\` DROP COLUMN \`idUsuario\``);
        
    }

}
