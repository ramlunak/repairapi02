import { IsBoolean, IsNumber, IsString } from "class-validator";
import { Unique } from "typeorm";

export class MarcaCrearDto {
    @IsString()
    marca:string;

    @IsString()
    imagen:string;

    @IsNumber()    
    idTaller:number;

    @IsNumber()
    idDispositivo?:number;

    @IsBoolean()
    activo:boolean;

}
