import {MigrationInterface, QueryRunner} from "typeorm";

export class cambiosCliente1643735187600 implements MigrationInterface {
    name = 'cambiosCliente1643735187600'

    public async up(queryRunner: QueryRunner): Promise<void> {
        
        await queryRunner.query(`ALTER TABLE \`u763815705_repair\`.\`cliente\` CHANGE \`apellidoPaterno\` \`apellidoPaterno\` varchar(50) NULL`);
        await queryRunner.query(`ALTER TABLE \`u763815705_repair\`.\`cliente\` CHANGE \`ApellidoMaterno\` \`ApellidoMaterno\` varchar(50) NULL`);
        await queryRunner.query(`ALTER TABLE \`u763815705_repair\`.\`cliente\` CHANGE \`dni\` \`dni\` varchar(50) NULL`);
        await queryRunner.query(`ALTER TABLE \`u763815705_repair\`.\`cliente\` CHANGE \`email\` \`email\` varchar(50) NULL`);
        await queryRunner.query(`ALTER TABLE \`u763815705_repair\`.\`cliente\` ADD UNIQUE INDEX \`IDX_9935842e3b6d6ac472cac5916b\` (\`telefono\`)`);
        await queryRunner.query(`ALTER TABLE \`u763815705_repair\`.\`cliente\` CHANGE \`direccion\` \`direccion\` varchar(50) NULL`);
        
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
       
        await queryRunner.query(`ALTER TABLE \`u763815705_repair\`.\`cliente\` CHANGE \`direccion\` \`direccion\` varchar(50) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`u763815705_repair\`.\`cliente\` DROP INDEX \`IDX_9935842e3b6d6ac472cac5916b\``);
        await queryRunner.query(`ALTER TABLE \`u763815705_repair\`.\`cliente\` CHANGE \`email\` \`email\` varchar(50) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`u763815705_repair\`.\`cliente\` CHANGE \`dni\` \`dni\` varchar(50) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`u763815705_repair\`.\`cliente\` CHANGE \`ApellidoMaterno\` \`ApellidoMaterno\` varchar(50) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`u763815705_repair\`.\`cliente\` CHANGE \`apellidoPaterno\` \`apellidoPaterno\` varchar(50) NOT NULL`);
       
    }

}
