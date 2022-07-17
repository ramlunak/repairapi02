import { IsNumber, IsString } from "class-validator";

export class CreateCompraDto {
    @IsNumber()
    cantidad:number; 

    @IsNumber()
    precioCompra:number;

    @IsNumber()
    idTaller:number;

    @IsNumber()
    idUsuario:number;

    @IsNumber()
    idArticulo:number;
}
