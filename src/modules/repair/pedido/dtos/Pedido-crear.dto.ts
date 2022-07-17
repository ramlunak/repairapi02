import { IsDate, isInt, IsInt, IsNumber, IsString } from "class-validator";

export class PedidoCrearDto {
    @IsString()
    pedido: string;

    @IsDate()
    fecha: Date;

    @IsInt()
    estado: number;

    @IsInt()
    idTaller: number;


}
