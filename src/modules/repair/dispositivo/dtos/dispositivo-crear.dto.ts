import { IsBoolean, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class DispositivoCrearDto {
    @IsString()
    dispositivo: string;

    
    imagen: string;

    @IsNotEmpty()
    @IsNumber()
    idTaller: number;

    @IsBoolean()
    activo: boolean;
}
