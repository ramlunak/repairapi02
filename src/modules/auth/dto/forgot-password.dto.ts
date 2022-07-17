import {IsString, IsPhoneNumber, IsNumber, IsEmail, Matches, MaxLength, MinLength, IsNotEmpty} from 'class-validator';


export class ForgotPasswordDto {  
  @IsNotEmpty()
  email:string;  
}