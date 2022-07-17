import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cuenta } from './cuenta/entity/cuenta.entity';
import { AuthModule } from '../auth/auth.module';
import { CuentaService } from './cuenta/services/cuenta/cuenta.service';
import { CuentaController } from './cuenta/controller/cuenta/cuenta.controller';

import { Diseno } from './diseno/entity/diseno.entity';
import { DisenoService } from './diseno/services/diseno/diseno.service';
import { DisenoController } from './diseno/controller/diseno.controller';
import { Moneda } from './moneda/entity/moneda.entity';
import { MonedaService } from './moneda/services/moneda.service';
import { MonedaController } from './moneda/controller/moneda.controller';
import { ImagenController } from './imagen/controller/imagen.controller';
import { Imagen } from './imagen/entity/imagen.entity';
import { ImagenService } from './imagen/services/imagen.service';
import { Taller } from './taller/entity/taller.entity';
import { TallerService } from './taller/services/taller.service';
import { TallerController } from './taller/controller/taller.controller';
import { Role } from './roles/entity/role.entity';
import { RoleServices } from './roles/services/role.services';
import { RoleController } from './roles/controller/role.controller';
import { MarcaEntity } from './marca/entity/marca.entity';
import { MarcaService } from './marca/services/marca.service';
import { MarcaController } from './marca/controller/marca.controller';
import { Dispositivo } from './dispositivo/entity/dispositivo.entity';
import { DispositivoService } from './dispositivo/services/dispositivo.service';
import { DispositivoController } from './dispositivo/controller/dispositivo.controller';
import { Tarea } from './tarea/entity/tarea.entity';
import { TareaService } from './tarea/services/tarea.service';
import { TareaController } from './tarea/controller/tarea.controller';
import { Pedido } from './pedido/entity/pedido.entity';
import { PedidoService } from './pedido/services/pedido.service';
import { PedidoController } from './pedido/controller/pedido.controller';
import { Cliente } from './cliente/entity/cliente.entity';
import { ClienteService } from './cliente/services/cliente.service';
import { ClienteController } from './cliente/controller/cliente.controller';
import { ModeloEntity } from './modelo/entity/modelo.entity';
import { ModeloService } from './modelo/services/modelo.service';
import { ModeloController } from './modelo/controller/modelo.controller';
import { ReparacionEntity } from './reparacion/entity/reparacion.entity';
import { ReparacionService } from './reparacion/services/reparacion.service';
import { ReparacionController } from './reparacion/controller/reparacion.controller';
import { ModeloReparacion } from './modelo/entity/modelo-reparacion';
import { OrdenReparacion } from './reparacion/entity/orden-reparacion.entity';
import { OrdenEntity } from './orden/entity/orden.entity';
import { OrdenService } from './orden/services/orden.service';
import { OrdenController } from './orden/controller/orden/orden.controller';
import { DispositivoMarca } from './dispositivo/entity/dispositivomarca.entity';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { join } from 'path';
import { Configuracion } from './configuracion/entity/configuracion.entity';
import { ConfiguracionService } from './configuracion/services/configuracion.service';
import { ConfiguracionController } from './configuracion/controller/configuracion.controller';


@Module({
  imports: [
    TypeOrmModule.forFeature([Cuenta, Moneda, Taller, Role,MarcaEntity, Dispositivo,Tarea, Pedido, 
      Cliente, ModeloEntity,ReparacionEntity,ModeloReparacion,OrdenReparacion,OrdenEntity,DispositivoMarca,Configuracion]),
      MailerModule.forRootAsync({
        // imports: [ConfigModule], // import module if not enabled globally
        useFactory: async (config: ConfigService) => ({
          // transport: config.get("MAIL_TRANSPORT"),
          // or
          transport: {
            host: config.get('MAIL_HOST'),
            secure: true,
            port: 465,
            //ignoreTLS: true,
            auth: {
              user: config.get('MAIL_USER'),
              pass: config.get('MAIL_PASSWORD'),
            },
          },
          defaults: {
            from: `"No Reply" <${config.get('MAIL_FROM')}>`,
          },
          template: {
            dir:  join(__dirname , '/templates'),
            adapter: new HandlebarsAdapter(),
            options: {
              strict: true,
            },
          },
        }),
        inject: [ConfigService],
      }),      
  ],
  providers: [CuentaService, 
    MonedaService,
    TallerService, RoleServices, 
    MarcaService, DispositivoService, 
    TareaService, PedidoService, 
    ClienteService, ModeloService,
    ReparacionService,OrdenService,ConfiguracionService
  ],
  controllers: [CuentaController, MonedaController,
    TallerController, RoleController, 
    MarcaController, DispositivoController, 
    TareaController, PedidoController, 
    ClienteController, ModeloController,
    ReparacionController,OrdenController,ConfiguracionController
  ]
})
export class RepairModule { }
