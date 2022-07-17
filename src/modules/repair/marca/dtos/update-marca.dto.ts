import { IsNumber, IsString } from "class-validator";

export class UpdateMarcaDto {
    @IsString()
    marca:string;

    @IsString()
    imagen:string;    

}