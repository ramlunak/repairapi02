import {MigrationInterface, QueryRunner, TableForeignKey} from "typeorm";

export class modificarTaller1636831730308 implements MigrationInterface {
    name = 'modificarTaller1636831730308'

    public async up(queryRunner: QueryRunner): Promise<void> {
        
        await queryRunner.query(`ALTER TABLE \`u763815705_repair\`.\`taller\` CHANGE \`direccion\` \`direccion\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`u763815705_repair\`.\`taller\` CHANGE \`detalles\` \`detalles\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`u763815705_repair\`.\`taller\` CHANGE \`condiciones\` \`condiciones\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`u763815705_repair\`.\`taller\` CHANGE \`informacionAdicional\` \`informacionAdicional\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`u763815705_repair\`.\`taller\` CHANGE \`email\` \`email\` varchar(50) NULL`);
        await queryRunner.query(`ALTER TABLE \`u763815705_repair\`.\`taller\` CHANGE \`ipimpresora\` \`ipimpresora\` varchar(15) NULL`);
        await queryRunner.query(`ALTER TABLE \`u763815705_repair\`.\`taller\` CHANGE \`logo\` \`logo\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`u763815705_repair\`.\`taller\` DROP FOREIGN KEY \`FK_31a80a6a1beabf20cbb3cf8e24c\``);
        await queryRunner.query(`ALTER TABLE \`u763815705_repair\`.\`taller\` CHANGE \`idDiseno\` \`idDiseno\` int NULL`);
        await queryRunner.createForeignKey('taller',new TableForeignKey({
            name: "FK_diseno",
            columnNames: ["idDiseno"],
            referencedColumnNames : ["idDiseno"],
            referencedTableName: "diseno",
            onDelete: "CASCADE"

        }));

        await queryRunner.query(`ALTER TABLE \`u763815705_repair\`.\`taller\` DROP FOREIGN KEY \`FK_c421832061bf2086b06b8dc6b7a\``);
        await queryRunner.query(`ALTER TABLE \`u763815705_repair\`.\`taller\` CHANGE \`idMoneda\` \`idMoneda\` int NULL`);
        await queryRunner.createForeignKey('taller',new TableForeignKey({
            name: "FK_moneda",
            columnNames: ["idMoneda"],
            referencedColumnNames : ["idMoneda"],
            referencedTableName: "moneda",
            onDelete: "CASCADE"

        }));
        await queryRunner.query(`ALTER TABLE \`u763815705_repair\`.\`taller\` DROP FOREIGN KEY \`FK_cuenta\``);
        await queryRunner.query(`ALTER TABLE \`u763815705_repair\`.\`taller\` CHANGE \`idCuenta\` \`idCuenta\` int NOT NULL`);
        await queryRunner.createForeignKey('taller',new TableForeignKey({
            name: "FK_cuenta",
            columnNames: ["idCuenta"],
            referencedColumnNames : ["idCuenta"],
            referencedTableName: "cuenta",
            onDelete: "CASCADE"

        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        
        await queryRunner.query(`ALTER TABLE \`u763815705_repair\`.\`taller\` DROP FOREIGN KEY \`FK_cuenta`);
        await queryRunner.query(`ALTER TABLE \`u763815705_repair\`.\`taller\` CHANGE \`idCuenta\` \`idCuenta\` int NULL`);
        await queryRunner.createForeignKey('taller',new TableForeignKey({
            name: "FK_cuenta",
            columnNames: ["idCuenta"],
            referencedColumnNames : ["idCuenta"],
            referencedTableName: "cuenta",
            onDelete: "CASCADE"

        }));
        await queryRunner.query(`ALTER TABLE \`u763815705_repair\`.\`taller\` DROP FOREIGN KEY \`FK_moneda`);
        await queryRunner.query(`ALTER TABLE \`u763815705_repair\`.\`taller\` CHANGE \`idMoneda\` \`idMoneda\` int NOT NULL`);
        await queryRunner.createForeignKey('taller',new TableForeignKey({
            name: "FK_moneda",
            columnNames: ["idMoneda"],
            referencedColumnNames : ["idMoneda"],
            referencedTableName: "moneda",
            onDelete: "CASCADE"

        }));

        await queryRunner.query(`ALTER TABLE \`u763815705_repair\`.\`taller\` DROP FOREIGN KEY \`FK_diseno`);
        await queryRunner.query(`ALTER TABLE \`u763815705_repair\`.\`taller\` CHANGE \`idDiseno\` \`idDiseno\` int NOT NULL`);
        await queryRunner.createForeignKey('taller',new TableForeignKey({
            name: "FK_diseno",
            columnNames: ["idDiseno"],
            referencedColumnNames : ["idDiseno"],
            referencedTableName: "diseno",
            onDelete: "CASCADE"

        }));
        await queryRunner.query(`ALTER TABLE \`u763815705_repair\`.\`taller\` CHANGE \`logo\` \`logo\` text NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`u763815705_repair\`.\`taller\` CHANGE \`ipimpresora\` \`ipimpresora\` varchar(15) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`u763815705_repair\`.\`taller\` CHANGE \`email\` \`email\` varchar(50) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`u763815705_repair\`.\`taller\` CHANGE \`informacionAdicional\` \`informacionAdicional\` text NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`u763815705_repair\`.\`taller\` CHANGE \`condiciones\` \`condiciones\` text NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`u763815705_repair\`.\`taller\` CHANGE \`detalles\` \`detalles\` text NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`u763815705_repair\`.\`taller\` CHANGE \`direccion\` \`direccion\` text NOT NULL`);
        
    }

}
