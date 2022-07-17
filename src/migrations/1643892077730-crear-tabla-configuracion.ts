import {MigrationInterface, QueryRunner} from "typeorm";

export class crearTablaConfiguracion1643892077730 implements MigrationInterface {
    name = 'crearTablaConfiguracion1643892077730'

    public async up(queryRunner: QueryRunner): Promise<void> {
        
        await queryRunner.query(`CREATE TABLE \`u763815705_repair\`.\`configuracion\` (\`idConfiguracion\` int NOT NULL AUTO_INCREMENT, \`taller_base\` int NOT NULL, PRIMARY KEY (\`idConfiguracion\`)) ENGINE=InnoDB`);
       
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      
        await queryRunner.query(`DROP TABLE \`u763815705_repair\`.\`configuracion\``);
        
    }

}
