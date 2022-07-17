/* eslint-disable prettier/prettier */
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join } from 'path';
import { ConnectionOptions } from 'typeorm';
const typeOrmConfig: TypeOrmModuleOptions = {
    type: 'mysql',    
    host: 'sql530.main-hosting.eu',
    port: 3306,
    username: 'u763815705_repairuser',
    password: 'U763815705_repairuser',
    database: 'u763815705_repair',
    autoLoadEntities: true,
    entities: [join(__dirname , '../**/**/*.entity{.ts,.js}')],
    synchronize: false,    
    migrationsRun: false,
    migrationsTableName: 'migrations_history',
    migrations:[join(__dirname,'../migrations/**/*{.ts,.js}')],      
    cli:{
      migrationsDir: 'src/migrations',
    },
};

export = typeOrmConfig
