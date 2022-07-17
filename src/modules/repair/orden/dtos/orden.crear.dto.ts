import { IsArray, IsInt, IsNumber, IsString } from "class-validator";


export class OrdenCrearDto {
    @IsString()
    moneda: string;

    @IsNumber()
    idTaller: number;

    @IsNumber()
    idCliente: number;

    @IsNumber()
    idModelo: number;

    @IsNumber()
    idMarca: number;

    @IsNumber()
    idUsuario: number;

    @IsNumber()
    idDispositivo: number;
    
    patron: number;

    pin:string;

    @IsNumber()
    precio: number;

    @IsArray()
    reparacion: number[];

    @IsInt()
    estado: number;   

    newCliente: any;
    
    fechaStatus: Date;
    
    dispositivo:string;
    marca:string;
    modelo:string;
    comentario:string;

}
