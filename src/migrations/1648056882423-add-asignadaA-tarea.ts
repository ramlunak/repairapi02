import {MigrationInterface, QueryRunner} from "typeorm";

export class addAsignadaATarea1648056882423 implements MigrationInterface {
    name = 'addAsignadaATarea1648056882423'

    public async up(queryRunner: QueryRunner): Promise<void> {
       
        await queryRunner.query(`ALTER TABLE \`u763815705_repair\`.\`tarea\` ADD \`asignadaA\` int NULL`);
        
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        
        await queryRunner.query(`ALTER TABLE \`u763815705_repair\`.\`tarea\` DROP COLUMN \`asignadaA\``);
        
    }

}
