/* eslint-disable prettier/prettier */
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join } from 'path';
import { ConnectionOptions } from 'typeorm';
const typeOrmConfig: TypeOrmModuleOptions = {
    type: 'mysql',    
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: '',
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

export = typeOrmConfig;