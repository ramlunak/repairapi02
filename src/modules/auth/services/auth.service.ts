import { BadRequestException, ConflictException, HttpException, HttpStatus, Injectable, NotFoundException, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common';
import { UserRepository } from '../user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDto } from '../dto/auth-credentials.dto';
import { JwtService } from '@nestjs/jwt';
import { TokenExpiredError } from 'jsonwebtoken';
import { JwtPayload } from '../dto/jwt-payload.interface';
import { UserEntity } from '../entity/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { MensajeModel } from 'src/models/mensaje.model';
import { getRepository } from 'typeorm';
import { Role } from 'src/modules/repair/roles/entity/role.entity';
import { ForgotPasswordDto } from '../dto/forgot-password.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfiguracionController } from 'src/modules/repair/configuracion/controller/configuracion.controller';
import { ConfigService } from '@nestjs/config';
import { ResetPasswordDto } from '../dto/reset-password.dto';






@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
  private userRepository:UserRepository,private readonly mailerService: MailerService,
    private jwtService:JwtService,private config:ConfigService 
  ) {}

  async signUp(createUserDto:CreateUserDto):Promise<MensajeModel>{

       const {email} = createUserDto

        const user_found = await this.userRepository.findOne({
          where: {
            email:email
          }
        })
        if (user_found) {
          throw new ConflictException("Este email ya existe.");
        }
        
        return this.userRepository.signUp(createUserDto);
  }
 

  async signIn(authCredentialsDto:AuthCredentialsDto):Promise<{accesToken:string, expirationTime: number, role: string, user: string, idcuenta: number, idtaller: number, idUsuario: number}>{
    const username =await this.userRepository.validateUserPassword(authCredentialsDto);
    if(!username){
      throw new UnauthorizedException('Credenciales Inválidas.');
    }
    const roleRepository = getRepository<Role>(Role);
    const user_found = await this.userRepository.findOne({username});
    const rol = await roleRepository.findOne(user_found.idRol);
    const payload:JwtPayload = { username };
    const accesToken = await this.jwtService.sign(payload);
    const expirationTime = 3600;
    const role = rol.rol;
    const idcuenta = user_found.idCuenta;
    const idtaller = user_found.idTaller;
    const user = user_found.username;
    const idUsuario = user_found.id;
    return { accesToken , expirationTime, role, user, idcuenta, idtaller, idUsuario};
  }

 async resetPassword(resetPassword: ResetPasswordDto): Promise<MensajeModel> {

  const {token,password} = resetPassword

  const data =await this.decodeResetPassword(token);

  const usuario = await  this.userRepository.findOne({
    username: data.username
  })

  if(!usuario){
    throw new HttpException('El usuario no exite en nuestro sistema.',HttpStatus.NOT_FOUND)
    
  }

  usuario.password = await this.userRepository.hastPassword(password,usuario.salt);
  await usuario.save();
  
  const respuesta = new MensajeModel();
  respuesta.mensaje = ['Se ha creado correctamente la nueva contraseña.'];
  
  return respuesta;
 }

async decodeResetPassword(token: string): Promise<JwtPayload>{

  try {
    return await this.jwtService.verify(token)
    
  } catch (error) {
    if(error instanceof TokenExpiredError) {
      throw new HttpException('El token ha expirado',HttpStatus.FORBIDDEN);      
    } else {
      throw new HttpException('El token está mal formado',HttpStatus.UNPROCESSABLE_ENTITY);  
    }
  }
  
}

 async forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<MensajeModel> {

  try {
    const user = await this.userRepository.findOne({
      email: forgotPasswordDto.email
    })

    if(!user){
      throw new BadRequestException('No existe un usuario con esta dirección de correo, por favor, verifique la dirección de correo o contacte con uno de nuestros administradores!')
    }
    const username = user.username;
    const id = user.id;
    const payload:JwtPayload = { username};
    const accesToken = await this.jwtService.sign(payload,{
      expiresIn: '1h',
      secret:'topSecret51'
    });
    const forgotlink = `${this.config.get<string>('WEB_URL_BASE')}/changepass?token=${accesToken}`;

    await this.mailerService.sendMail({
      to: user.email,
      from: this.config.get<string>('MAIL_USER'),      
      subject: 'Bienvenido a nuestra aplicación! Recuperar contraseña',
      html: `
      <h3>Hola, ${user.username}! </h3>
      <p>Recibimos una solicitud para cambiar la contraseña de su cuenta BestMobile.
      <br>Para continuar haga click en el enlace a continuación: <a href="${forgotlink}">Link</a> </br>
      <br></br>
      <br>Si no iba a cambiar la contraseña, simplemente ignore este email y su contraseña permanecerá sin cambios.</br>      
      </p>
      `
    });
    const respuesta = new MensajeModel();
    respuesta.mensaje = ['Las instrucciones de recuperación de su contraseña han sido enviadas a su correo electrónico.'];
    
    return respuesta;
  } catch (error) {
    if (error.code === 'EDNS') {
      throw new BadRequestException('Error de conexión.');
    } else {
      throw new BadRequestException(error);
    }
    
  }
    
   
   
 }
  
}
