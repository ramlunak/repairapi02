import { IsBoolean, IsDecimal, IsNumber, IsString } from "class-validator";

export class ReparacionUpdateDto {
    @IsString()
    reparacion:string;

    @IsString()
    imagen:string;

    @IsNumber()
    idModelo:number;

    @IsNumber()
    precio: number;

    @IsBoolean()
    activo: boolean;
   
}
