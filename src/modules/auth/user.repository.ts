import {Repository , EntityRepository} from 'typeorm';
import { ConflictException, InternalServerErrorException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserEntity } from './entity/user.entity';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { MensajeModel } from 'src/models/mensaje.model';

@EntityRepository(UserEntity)
export class UserRepository extends Repository<UserEntity>{

  async signUp(createUserDto:CreateUserDto):Promise<MensajeModel>{
    const {username , password, status, idCuenta, idTaller, idRol, email} = createUserDto;   
    //Crear objeto
    const user = new UserEntity();
    user.username = username;
    user.status = status;
    user.email = email;
    user.idCuenta = idCuenta;
    if(idTaller > 0) {
      user.idTaller = idTaller;
    }    
    user.idRol = idRol;
    user.salt = await bcrypt.genSalt();
    user.password = await this.hastPassword(password,user.salt);
    const mensaje = "Usuario creado.";
    try {
      
      const respuesta = new MensajeModel();
      respuesta.mensaje = [mensaje];
      respuesta.data = await await user.save();
      return respuesta;
      
    } catch (error) {
      //console.log(error);
      if (error.code === 'ER_DUP_ENTRY'){
        throw new ConflictException("El nombre de usuario ya existe.");
      }else {
        throw new InternalServerErrorException();
      }

    }

  }
  async validateUserPassword(authCredentialsDto:AuthCredentialsDto):Promise<string>{
      const {username , password} = authCredentialsDto;
      const user = await this.findOne({username});

      if (user && await user.validatePassword(password)){
        return user.username;
      }else {
        return null;
      }
  }
   async hastPassword(password:string,salt:string):Promise<string>{
    return bcrypt.hash(password,salt);
  }
}