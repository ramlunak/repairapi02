import { IsDecimal, IsNumber, IsString } from "class-validator";

export class CreateArticuloDto {
    @IsNumber()
    stock:number; 
    
    @IsString()
    nombre:string;

    @IsNumber()
    precio:number;

    @IsNumber()
    idUsuario:number;

    @IsNumber()
    precioCompra:number;

    @IsNumber()
    idTaller:number;
}
