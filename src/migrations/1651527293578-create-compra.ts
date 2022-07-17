import {MigrationInterface, QueryRunner} from "typeorm";

export class createCompra1651527293578 implements MigrationInterface {
    name = 'createCompra1651527293578'

    public async up(queryRunner: QueryRunner): Promise<void> {
        
        await queryRunner.query(`CREATE TABLE \`u763815705_repair\`.\`compra\` (\`idCompra\` int NOT NULL AUTO_INCREMENT, \`idArticulo\` int NOT NULL, \`cantidad\` int NOT NULL, \`idUsuario\` int NOT NULL, \`precioCompra\` decimal NOT NULL, \`idTaller\` int NOT NULL, \`created_at\` date NOT NULL, PRIMARY KEY (\`idCompra\`)) ENGINE=InnoDB`);
        
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        
        await queryRunner.query(`DROP TABLE \`u763815705_repair\`.\`compra\``);
        
    }

}
