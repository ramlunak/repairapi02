import { IsBoolean, IsNumber, IsString } from "class-validator";

export class UpdateEstadoDto {
    @IsBoolean()
    activo:boolean;

    @IsNumber()
    idMarca:number;
    
    @IsNumber()
    idDispositivo:number; 

}