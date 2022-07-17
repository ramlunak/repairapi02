import { PassportStrategy } from '@nestjs/passport';

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtPayload } from './dto/jwt-payload.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { UserEntity } from './entity/user.entity';
import { Strategy, ExtractJwt} from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
  constructor(
    @InjectRepository(UserRepository)
    private userRepository:UserRepository,
  ) {
    super({
      jwtFromRequest : ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey : 'topSecret51',
    });

  }


  async validate(payload : JwtPayload):Promise<UserEntity>{
    const { username } = payload;
    const user = await this.userRepository.findOne({username})
    if (!user){
      throw new UnauthorizedException()
    }

    return user;
  }
}

