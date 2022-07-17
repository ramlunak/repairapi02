import {MigrationInterface, QueryRunner} from "typeorm";

export class cambiarIdcuentaUsuario1640830983050 implements MigrationInterface {
    name = 'cambiarIdcuentaUsuario1640830983050'

    public async up(queryRunner: QueryRunner): Promise<void> {
       
        await queryRunner.query(`ALTER TABLE \`u763815705_repair\`.\`seg_usuario\` DROP FOREIGN KEY \`fk_cuenta_usuario\``);
     
        
        await queryRunner.query(`ALTER TABLE \`u763815705_repair\`.\`seg_usuario\` CHANGE \`idCuenta\` \`idCuenta\` int NULL`);
       
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        
        await queryRunner.query(`ALTER TABLE \`u763815705_repair\`.\`seg_usuario\` CHANGE \`idCuenta\` \`idCuenta\` int NOT NULL`);
      
       
        await queryRunner.query(`ALTER TABLE \`u763815705_repair\`.\`seg_usuario\` ADD CONSTRAINT \`fk_cuenta_usuario\` FOREIGN KEY (\`idCuenta\`) REFERENCES \`u763815705_repair\`.\`cuenta\`(\`idCuenta\`) ON DELETE RESTRICT ON UPDATE RESTRICT`);
        
    }

}
