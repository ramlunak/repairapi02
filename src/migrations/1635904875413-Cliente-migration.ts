import {MigrationInterface, QueryRunner} from "typeorm";

export class ClienteMigration1635904875413 implements MigrationInterface {
    name = 'ClienteMigration1635904875413'

    public async up(queryRunner: QueryRunner): Promise<void> {
        
        await queryRunner.query(`CREATE TABLE \`u763815705_repair\`.\`cliente\` (\`idCliente\` int NOT NULL AUTO_INCREMENT, \`nombre\` varchar(50) NOT NULL, \`apellidoPaterno\` varchar(50) NOT NULL, \`ApellidoMaterno\` varchar(50) NOT NULL, \`dni\` varchar(50) NOT NULL, \`email\` varchar(50) NOT NULL, \`telefono\` varchar(50) NOT NULL, \`direccion\` varchar(50) NOT NULL, \`idTaller\` int NOT NULL, PRIMARY KEY (\`idCliente\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`u763815705_repair\`.\`cliente\` ADD CONSTRAINT \`FK_483fa308c4c46ffd9a53d7f452e\` FOREIGN KEY (\`idTaller\`) REFERENCES \`u763815705_repair\`.\`taller\`(\`idTaller\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        
        await queryRunner.query(`ALTER TABLE \`u763815705_repair\`.\`cliente\` DROP FOREIGN KEY \`FK_483fa308c4c46ffd9a53d7f452e\``);
        await queryRunner.query(`DROP TABLE \`u763815705_repair\`.\`cliente\``);
       
    }

}
