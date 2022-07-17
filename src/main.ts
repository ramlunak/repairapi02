import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {Logger, ValidationPipe} from '@nestjs/common';
import {ConfigService} from "@nestjs/config";
import { setDefaultRol } from './config/default-role.config';
import { setDefaultUser } from './config/default-user.config';
import { setDefaultCuenta } from './config/default-cuenta.config';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials:true,
    
  });
  const config = app.get(ConfigService);
 
 // await setDefaultCuenta(config);
  await setDefaultRol(config);
  await setDefaultUser(config);
  await app.listen(3000);
}
bootstrap();
