import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class DispositivoMarcaCrearDto {
    
    @IsNumber()
    idDispositivo: number;

    @IsNumber()
    idMarca: number;
}
