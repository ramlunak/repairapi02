import { IsNumber, IsString } from "class-validator";

export class CreateVentaDto {
    @IsNumber()
    idArticulo:number;    

    @IsNumber()
    idUsuario:number;

    @IsNumber()
    cantidadVendida:number;

    precioVentaFinal:number;
    
    @IsNumber()
    idTaller:number;

    @IsString()
    nombre:string
    
    estado:number;
}
