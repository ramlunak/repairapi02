import {IsString, IsPhoneNumber, IsNumber, IsEmail, Matches, MaxLength, MinLength, IsNotEmpty} from 'class-validator';


export class CambioPasswordDto {
  

  @IsString()
  @IsNotEmpty() 
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/,{message:"Contraseña débil"})

  password:string;

  
}