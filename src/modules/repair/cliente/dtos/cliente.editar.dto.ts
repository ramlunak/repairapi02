import { IsString } from "class-validator";

export class ClienteEditarDto{

    @IsString()
    nombre:string;

    @IsString() 
    apellidoPaterno:string;
   
}