import {MigrationInterface, QueryRunner, TableForeignKey} from "typeorm";

export class AddIdPeronaColumn1634839083052 implements MigrationInterface {
    name = 'AddIdPeronaColumn1634839083052'

    public async up(queryRunner: QueryRunner): Promise<void> {
        
        await queryRunner.query(`ALTER TABLE \`u763815705_repair\`.\`taller\` ADD \`idCuenta\` int NULL`);
        await queryRunner.createForeignKey('taller',new TableForeignKey({
            name: "FK_cuenta",
            columnNames: ["idCuenta"],
            referencedColumnNames : ["idCuenta"],
            referencedTableName: "cuenta",
            onDelete: "CASCADE"

        }))
        //await queryRunner.query(`ALTER TABLE \`u763815705_repair\`.\`taller\` ADD CONSTRAINT \`FK_00d4be5cc7eed17482cd71b86da\` FOREIGN KEY (\`idCuenta\`) REFERENCES \`u763815705_repair\`.\`cuenta\`(\`idCuenta\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`u763815705_repair\`.\`taller\` DROP FOREIGN KEY \`FK_cuenta\``);
       
        await queryRunner.query(`ALTER TABLE \`u763815705_repair\`.\`taller\` DROP COLUMN \`idCuenta\``);
       
    }

}
