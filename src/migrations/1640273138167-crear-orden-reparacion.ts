import {MigrationInterface, QueryRunner} from "typeorm";

export class crearOrdenReparacion1640273138167 implements MigrationInterface {
    name = 'crearOrdenReparacion1640273138167'

    public async up(queryRunner: QueryRunner): Promise<void> {
       
        await queryRunner.query(`CREATE TABLE \`u763815705_repair\`.\`orden_reparacion\` (\`idOrdenReparacion\` int NOT NULL AUTO_INCREMENT, \`idOrden\` int NOT NULL, \`idReparacion\` int NOT NULL, INDEX \`IDX_96b9f24e43efd7602e9cc16cd9\` (\`idOrden\`), INDEX \`IDX_9a3460fd060a6dbaa2c23e6aa3\` (\`idReparacion\`), PRIMARY KEY (\`idOrdenReparacion\`)) ENGINE=InnoDB`);
        
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        
        await queryRunner.query(`DROP INDEX \`IDX_9a3460fd060a6dbaa2c23e6aa3\` ON \`u763815705_repair\`.\`orden_reparacion\``);
        await queryRunner.query(`DROP INDEX \`IDX_96b9f24e43efd7602e9cc16cd9\` ON \`u763815705_repair\`.\`orden_reparacion\``);
        await queryRunner.query(`DROP TABLE \`u763815705_repair\`.\`orden_reparacion\``);
       
    }

}
