import { IsBoolean, IsNumber, IsString } from "class-validator";

export class ModeloCrearDto {
    @IsString()
    modelo:string;

    @IsString()
    imagen:string;

    @IsNumber()
    idMarca:number; 

    @IsNumber()
    idDispositivo:number;

    @IsBoolean()
    activo: boolean;

    @IsNumber()
    idTaller: number;

}
