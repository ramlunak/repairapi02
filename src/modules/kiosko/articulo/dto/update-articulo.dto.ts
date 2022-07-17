
import { IsNumber, IsString } from 'class-validator';
import { CreateArticuloDto } from './create-articulo.dto';

export class UpdateArticuloDto{
    @IsNumber()
    stock:number;  

    @IsString()
    nombre:string;

    @IsNumber()
    precio:number;

    @IsNumber()
    precioCompra:number;
    
    @IsNumber()
    idTaller:number;  
}
