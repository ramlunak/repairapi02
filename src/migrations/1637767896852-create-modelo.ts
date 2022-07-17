import {MigrationInterface, QueryRunner} from "typeorm";

export class createModelo1637767896852 implements MigrationInterface {
    name = 'createModelo1637767896852'

    public async up(queryRunner: QueryRunner): Promise<void> {
        
        
        await queryRunner.query(`ALTER TABLE \`u763815705_repair\`.\`modelo\` DROP FOREIGN KEY \`modelo_ibfk_2\``);
        await queryRunner.query(`ALTER TABLE \`u763815705_repair\`.\`modelo\` DROP FOREIGN KEY \`modelo_ibfk_3\``);
        
       
       
        await queryRunner.query(`DROP INDEX \`idTaller\` ON \`u763815705_repair\`.\`modelo\``);
        await queryRunner.query(`DROP INDEX \`idDispositivo\` ON \`u763815705_repair\`.\`modelo\``);
       
        await queryRunner.query(`ALTER TABLE \`u763815705_repair\`.\`modelo\` DROP COLUMN \`idTaller\``);
        await queryRunner.query(`ALTER TABLE \`u763815705_repair\`.\`modelo\` DROP COLUMN \`idDispositivo\``);
      
        await queryRunner.query(`ALTER TABLE \`u763815705_repair\`.\`modelo\` DROP COLUMN \`imagen\``);
        await queryRunner.query(`ALTER TABLE \`u763815705_repair\`.\`modelo\` ADD \`imagen\` text NULL`);
        
      
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        
       
        await queryRunner.query(`ALTER TABLE \`u763815705_repair\`.\`modelo\` DROP COLUMN \`imagen\``);
        await queryRunner.query(`ALTER TABLE \`u763815705_repair\`.\`modelo\` ADD \`imagen\` blob NULL`);
       
        
        await queryRunner.query(`ALTER TABLE \`u763815705_repair\`.\`modelo\` ADD \`idDispositivo\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`u763815705_repair\`.\`modelo\` ADD \`idTaller\` int NOT NULL`);
       
        await queryRunner.query(`CREATE INDEX \`idDispositivo\` ON \`u763815705_repair\`.\`modelo\` (\`idDispositivo\`)`);
        await queryRunner.query(`CREATE INDEX \`idTaller\` ON \`u763815705_repair\`.\`modelo\` (\`idTaller\`)`);
        
       
        await queryRunner.query(`ALTER TABLE \`u763815705_repair\`.\`modelo\` ADD CONSTRAINT \`modelo_ibfk_3\` FOREIGN KEY (\`idDispositivo\`) REFERENCES \`u763815705_repair\`.\`dispositivo\`(\`idDispositivo\`) ON DELETE RESTRICT ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`u763815705_repair\`.\`modelo\` ADD CONSTRAINT \`modelo_ibfk_2\` FOREIGN KEY (\`idTaller\`) REFERENCES \`u763815705_repair\`.\`taller\`(\`idTaller\`) ON DELETE RESTRICT ON UPDATE CASCADE`);
       
    }

}
