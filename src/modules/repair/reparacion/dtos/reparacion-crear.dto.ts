import { IsBoolean, IsDecimal, IsNumber, IsString } from "class-validator";

export class ReparacionCrearDto {
    @IsString()
    reparacion:string;

    
    imagen:string;

    @IsNumber()
    idTaller:number;

    @IsNumber()
    idDispositivo:number;

    @IsDecimal()
    precio:number;

    @IsNumber()
    idModelo:number;

    @IsBoolean()
    activo:boolean;
}
