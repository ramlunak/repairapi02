import { IsString } from "class-validator";

export class DisenoCrearDto {
    @IsString()
    diseno:string;
}