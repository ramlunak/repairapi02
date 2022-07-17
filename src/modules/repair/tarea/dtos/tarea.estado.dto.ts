import { IsEmail, IsPhoneNumber, IsString, IsNotEmpty, IsDate, IsNumber } from "class-validator";
import { OrdenEntity } from "../../orden/entity/orden.entity";

export class TareaEstadoDto {   

    @IsNumber()
    estado: number;  
  
}