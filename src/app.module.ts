import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from './modules/auth/auth.module';
import { RepairModule } from './modules/repair/repair.module';

import * as typeOrmConfig from './config/typeorm.config';
import { ConfigModule } from '@nestjs/config';
import { MailModule } from './modules/mail/mail.module';
import { KioskoModule } from './modules/kiosko/kiosko.module';

@Module({
  imports: [TypeOrmModule.forRoot(typeOrmConfig), ConfigModule.forRoot( {isGlobal: true}), AuthModule, RepairModule, MailModule,KioskoModule
  ],
  controllers: [
    AppController,

  ],
  providers: [
    AppService,
  ],
})
export class AppModule { }
