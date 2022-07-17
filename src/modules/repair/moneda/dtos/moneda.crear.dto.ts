import { IsString } from "class-validator";

export class MonedaCrearDto {
    @IsString()
    moneda:string;

    @IsString()
    simbolo:string;
}
