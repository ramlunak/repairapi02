import {MigrationInterface, QueryRunner} from "typeorm";

export class cambiarCuenta1640966076730 implements MigrationInterface {
    name = 'cambiarCuenta1640966076730'

    public async up(queryRunner: QueryRunner): Promise<void> {
      
        await queryRunner.query(`ALTER TABLE \`u763815705_repair\`.\`cuenta\` CHANGE \`apellidoPaterno\` \`apellidoPaterno\` varchar(50) NULL`);
        await queryRunner.query(`ALTER TABLE \`u763815705_repair\`.\`cuenta\` CHANGE \`ApellidoMaterno\` \`ApellidoMaterno\` varchar(50) NULL`);
        await queryRunner.query(`ALTER TABLE \`u763815705_repair\`.\`cuenta\` CHANGE \`dni\` \`dni\` varchar(50) NULL`);
        await queryRunner.query(`ALTER TABLE \`u763815705_repair\`.\`cuenta\` CHANGE \`email\` \`email\` varchar(50) NULL`);
        await queryRunner.query(`ALTER TABLE \`u763815705_repair\`.\`cuenta\` CHANGE \`telefono\` \`telefono\` varchar(50) NULL`);
        await queryRunner.query(`ALTER TABLE \`u763815705_repair\`.\`cuenta\` CHANGE \`direccion\` \`direccion\` varchar(50) NULL`);
       
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        
        await queryRunner.query(`ALTER TABLE \`u763815705_repair\`.\`cuenta\` CHANGE \`direccion\` \`direccion\` varchar(50) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`u763815705_repair\`.\`cuenta\` CHANGE \`telefono\` \`telefono\` varchar(50) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`u763815705_repair\`.\`cuenta\` CHANGE \`email\` \`email\` varchar(50) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`u763815705_repair\`.\`cuenta\` CHANGE \`dni\` \`dni\` varchar(50) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`u763815705_repair\`.\`cuenta\` CHANGE \`ApellidoMaterno\` \`ApellidoMaterno\` varchar(50) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`u763815705_repair\`.\`cuenta\` CHANGE \`apellidoPaterno\` \`apellidoPaterno\` varchar(50) NOT NULL`);
       
    }

}
