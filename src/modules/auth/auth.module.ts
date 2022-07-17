import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { AuthController } from './controller/auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import {JwtModule} from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from './users/users.module';


@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({ 
      secret:'topSecret51',      
      signOptions:{
        expiresIn:3600,
      },     
      
    }),
    TypeOrmModule.forFeature([UserRepository]),
    UsersModule
  ],
  controllers :[AuthController],
  providers: [
    AuthService,
    JwtStrategy,
  ],
  exports:[
    JwtStrategy,
    PassportModule,   
  ]
})
export class AuthModule {}
