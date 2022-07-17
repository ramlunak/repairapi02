import { IsDate, IsInt, IsNumber, IsString } from "class-validator";

export class PedidoUpdateDto {
    @IsString()
    pedido: string;

    @IsDate()
    fecha: Date;

    @IsInt()
    estado: number;

    @IsInt()
    idTaller: number;


}
