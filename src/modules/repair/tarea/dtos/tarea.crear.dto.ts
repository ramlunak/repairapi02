import { IsEmail, IsPhoneNumber, IsString, IsNotEmpty, IsDate, IsNumber } from "class-validator";
import { OrdenEntity } from "../../orden/entity/orden.entity";

export class TareaCrearDto {

    @IsString()
    tarea: string;

    @IsString()
    nota: string;

    @IsDate()
    fecha: Date;

    @IsDate()
    fechaLimite: Date;

    @IsNumber()
    estado: number;

    @IsNumber()
    idTaller: number;

    @IsNumber()
    idUsuario: number;

    @IsNumber()
    idOrden: number;

    @IsNumber()
    asignadaA: number;
    
    orden: OrdenEntity;
}