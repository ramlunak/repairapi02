import { IsArray, IsInt, IsNumber, IsString } from "class-validator";


export class OrdenPrintDto {   

    @IsNumber()
    idOrden: number;   

}
