import {MigrationInterface, QueryRunner} from "typeorm";

export class kiosko1650939577893 implements MigrationInterface {
    name = 'kiosko1650939577893'

    public async up(queryRunner: QueryRunner): Promise<void> {
       
        await queryRunner.query(`CREATE TABLE \`u763815705_repair\`.\`articulo\` (\`idArticulo\` int NOT NULL AUTO_INCREMENT, \`stock\` int NOT NULL, \`precio\` decimal NOT NULL, PRIMARY KEY (\`idArticulo\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`u763815705_repair\`.\`venta\` (\`idVenta\` int NOT NULL AUTO_INCREMENT, \`idArticulo\` int NOT NULL, \`idUsuario\` int NOT NULL, \`cantidadVendida\` int NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`idVenta\`)) ENGINE=InnoDB`);
        
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        
        await queryRunner.query(`DROP TABLE \`u763815705_repair\`.\`venta\``);
        await queryRunner.query(`DROP TABLE \`u763815705_repair\`.\`articulo\``);
        
    }

}
