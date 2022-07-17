import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ArticuloController } from './articulo/controller/articulo.controller';
import { ArticuloEntity } from './articulo/entity/articulo.entity';
import { ArticuloService } from './articulo/service/articulo.service';
import { VentaController } from './venta/controller/venta.controller';
import { VentaEntity } from './venta/entity/venta.entity';
import { VentaService } from './venta/service/venta.service';

import { CompraController } from './compra/controller/compra.controller';
import { CompraService } from './compra/services/compra.service';
import { CompraEntity } from './compra/entity/compra.entity';




@Module({
  imports: [
    TypeOrmModule.forFeature([ArticuloEntity,VentaEntity,CompraEntity]),
    
    
  ],
  controllers: [ArticuloController,VentaController,CompraController],
  providers: [ArticuloService,VentaService,CompraService]
})
export class KioskoModule {}
