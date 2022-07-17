import { IsEmail, IsPhoneNumber, IsString, IsNotEmpty, IsDate, IsNumber } from "class-validator";
import { OrdenEntity } from "../../orden/entity/orden.entity";

export class TareaUpdateDto {

    @IsString()
    tarea: string;

    @IsString()
    nota: string;   

    @IsNumber()
    idTaller: number;

    @IsNumber()
    asignadaA: number;
    
    orden: OrdenEntity;

    @IsDate()
    fechaLimite: Date;
}