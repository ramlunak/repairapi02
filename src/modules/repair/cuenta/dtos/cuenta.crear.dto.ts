import { IsEmail, IsPhoneNumber, IsString, IsNotEmpty, IsBoolean } from "class-validator";

export class CuentaCrearDto{

    @IsString()
    nombre:string;

    
    apellidoPaterno:string;

    
    ApellidoMaterno:string;

    
    dni:string;

    
    email:string;

    
    telefono:string;

    
    direccion:string;
    
}