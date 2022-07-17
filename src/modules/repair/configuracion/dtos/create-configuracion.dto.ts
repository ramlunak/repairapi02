import { IsNumber } from "class-validator";

export class CreateConfiguracionDto {
    @IsNumber()
    taller_base:number;
}
