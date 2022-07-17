import { IsNumber, IsString } from 'class-validator';
import { CreateArticuloDto } from './create-articulo.dto';

export class AddcantidadArticuloDto{
   
    @IsNumber()
    cantidad:number;

    @IsNumber()
    precioCompra:number;
    
    @IsNumber()
    idUsuario:number;

    
}