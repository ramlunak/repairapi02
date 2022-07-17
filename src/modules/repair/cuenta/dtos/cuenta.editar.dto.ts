import { IsString } from "class-validator";

export class CuentaEditarDto{

    @IsString()
    nombre:string;

    @IsString() 
    apellidoPaterno:string;
   
}