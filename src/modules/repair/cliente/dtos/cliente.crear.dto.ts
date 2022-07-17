import { IsEmail, IsPhoneNumber, IsString, IsNotEmpty, IsNumber } from "class-validator";

export class ClienteCrearDto{

    @IsString()
    nombre:string;

    @IsString() 
    apellidoPaterno:string;

    @IsString() 
    ApellidoMaterno:string;

    @IsString() 
    dni:string;

    @IsEmail()
    email:string;

    @IsString()
    telefono:string;

    @IsString()
    direccion:string;

    @IsNumber()
    idTaller: number;
}