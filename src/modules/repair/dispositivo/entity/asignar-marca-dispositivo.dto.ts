import { IsNotEmpty } from 'class-validator';
import { MarcaEntity } from '../../marca/entity/marca.entity';


export class AsignarMarcaDispositivoDto {
    
    @IsNotEmpty()
    idDispositivo: number;

    marcas: number[];
} 
