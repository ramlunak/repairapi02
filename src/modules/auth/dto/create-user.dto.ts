import {IsString, IsPhoneNumber, IsNumber, IsEmail, Matches, MaxLength, MinLength, IsNotEmpty} from 'class-validator';


import { Cuenta } from 'src/modules/repair/cuenta/entity/cuenta.entity';
import { Role } from 'src/modules/repair/roles/entity/role.entity';

export class CreateUserDto {
  
  

  @IsString()
  @IsNotEmpty({message:"El campo del nombre de usuario no debe estar vacío"})
  @MinLength(4)
  @MaxLength(50) 
  username:string;//dsdddfdf

  @IsString({message:"Debe ser un string"})
  @IsNotEmpty({message:"La contraseña no debe estar vacía"})
  @MinLength(8,{message:"El valor mínimo es 8 caracteres"})
  @MaxLength(20,{message:"El valor máximo es 20 caracteres"})
  @Matches(/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,}).*$/,{message:"La contraseña es muy débil"})

  password:string;

  @IsNumber()
  status:number;

  @IsNotEmpty()
  @IsNumber()
  idCuenta:number
  
  @IsNotEmpty()
  @IsNumber()
  idRol: number;

  @IsNotEmpty()
  email:string;

  
  idTaller: number;
}
