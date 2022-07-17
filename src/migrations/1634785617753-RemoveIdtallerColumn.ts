import {MigrationInterface, QueryRunner} from "typeorm";

export class RemoveIdtallerColumn1634785617753 implements MigrationInterface {
    name = 'RemoveIdtallerColumn1634785617753'

    public async up(queryRunner: QueryRunner): Promise<void> {
       
        await queryRunner.query("ALTER TABLE `cuenta` DROP COLUMN `idTaller`");
       
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        
        await queryRunner.query("ALTER TABLE `cuenta` ADD `idTaller` int NOT NULL");
        
    }

}
