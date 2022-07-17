import { IsString, IsNumber, IsNotEmpty } from "class-validator";



export class ImagenCrearDto {
    @IsNotEmpty()
    @IsNumber()
    idDiseno:number;
    @IsString()   
    imagen:string;
}
