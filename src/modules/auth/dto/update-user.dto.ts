import {IsString, IsPhoneNumber, IsNumber, IsEmail, Matches, MaxLength, MinLength, IsNotEmpty} from 'class-validator';


import { Cuenta } from 'src/modules/repair/cuenta/entity/cuenta.entity';
import { Role } from 'src/modules/repair/roles/entity/role.entity';

export class UpdateUserDto {  

  @IsString()
  @IsNotEmpty() 
  username:string;  

  @IsNumber()
  @IsNotEmpty()
  status:number;

  
  idCuenta:number
  
  @IsNotEmpty()
  idRol: number;

  
  idTaller: number;

  @IsNotEmpty()
  email: string;
}
