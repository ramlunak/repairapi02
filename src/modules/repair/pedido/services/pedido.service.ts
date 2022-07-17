import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';
import { MensajeModel } from 'src/models/mensaje.model';
import { Brackets, getRepository, Repository } from 'typeorm';
import { Taller } from '../../taller/entity/taller.entity';
import { PedidoCrearDto } from '../dtos/Pedido-crear.dto';
import { PedidoUpdateDto } from '../dtos/pedido-update.dto';

import { Pedido } from '../entity/pedido.entity';

@Injectable()
export class PedidoService {
    constructor(
        @InjectRepository(Pedido)
        private readonly pedidoRepository: Repository<Pedido>
    ) { }

    async getAll(): Promise<Pedido[]> {
        return await this.pedidoRepository.find();
    }

    async countPorEstado(idTaller: number): Promise<Pedido[]> {
        let idtaller: number = Number(idTaller);
        const query = this.pedidoRepository.createQueryBuilder('pedido');
        query.where('pedido.idTaller = :idtaller',{idtaller})   
        query.select('pedido.estado as estado')
        query.addSelect('COUNT(*) estadocount')
        query.groupBy('pedido.estado')
        const result = await query.getRawMany()
    
        return result;
    
    }


    async paginate(options: IPaginationOptions, search: string, field: string, order: number,idTaller: number,estado: number,filtro_fecha:string,fechai:string,fechaf:string): Promise<Pagination<Pedido>> {
        const orderby = order == 1 ? 'ASC' : 'DESC';
        let idtaller: number = Number(idTaller);
        let estado_filter: number = Number(estado);
        const queryBuilder = this.pedidoRepository.createQueryBuilder('pedido');
        queryBuilder.andWhere(new Brackets(qb=>{
            qb.where('pedido.pedido LIKE :search', { search: `%${search}%` })
            .orWhere('pedido.fecha LIKE :search', { search: `%${search}%` });
        }))
        if(estado_filter > 0){
            queryBuilder.andWhere('pedido.estado = :estado',{estado:estado_filter})
        }
        if(fechai.length > 0 && fechaf.length > 0) {
            
            queryBuilder.andWhere('pedido.fecha >= :fechai',{fechai})
            queryBuilder.andWhere('pedido.fecha <= :fechaf',{fechaf})
            
          }
        if(filtro_fecha.length > 0) {     
            switch (filtro_fecha) {
                case 'today':
                  let hoy = new Date();                 
                  queryBuilder.andWhere('pedido.fecha = :hoy',{hoy:hoy.toLocaleDateString('sv-SE')})
                  break;
                case 'yesterday':
                  let ayer = new Date();
                  ayer.setDate(ayer.getDate() - 1);
                  queryBuilder.andWhere('pedido.fecha = :ayer',{ayer:ayer.toLocaleDateString('sv-SE')})
                  break;
                case 'lastweek':
                  let lastweek = new Date();
                  lastweek.setDate(lastweek.getDate() - lastweek.getDay());
                  queryBuilder.andWhere('pedido.fecha >= :lastweek',{lastweek:lastweek.toLocaleDateString('sv-SE')})
                  break;
                case 'lastmonth':
                  let lastmonth = new Date();
                  lastmonth.setDate(1);
                  queryBuilder.andWhere('pedido.fecha >= :lastmonth',{lastmonth:lastmonth.toLocaleDateString('sv-SE')})
                  break;
                default:
                  break;
              }
        }                
        queryBuilder.andWhere('pedido.idTaller = :idtaller', {idtaller})
        queryBuilder.orderBy('pedido.' + field, orderby);
         // Or whatever you need to do

        return paginate<Pedido>(queryBuilder, options);
    }

    async findOnPedido(id: number): Promise<MensajeModel> {
        const found_pedido = await this.pedidoRepository.findOne(id)
        if (!found_pedido) {
            throw new NotFoundException(`Pedido con ID "${id}" no encontrado.`)
        }

        const respuesta = new MensajeModel();
        respuesta.mensaje = ['Se ha encontrado una coincidencia'];
        respuesta.data = found_pedido;
        return respuesta;
    }

    async deletePedido(id: number): Promise<MensajeModel> {
        const result = await this.pedidoRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Pedido con ID "${id}" no se ha encontrado.`);
        }
        const respuesta = new MensajeModel();
        respuesta.mensaje = ['Se ha eliminado correctamente.'];
        return respuesta;

    }

    async savePedido(createPedido: PedidoCrearDto): Promise<MensajeModel> {
        const { pedido, estado, idTaller } = createPedido;
        //const result_taller = await getRepository<Taller>(Taller).findOne(idTaller);

        const pedido_nuevo = new Pedido();
        pedido_nuevo.idTaller = idTaller;
        pedido_nuevo.estado = estado;
        pedido_nuevo.fecha = new Date();
        pedido_nuevo.pedido = pedido
        await pedido_nuevo.save();
        if (!pedido_nuevo) {
            throw new NotFoundException(`Pedido no insertado.`)
        }
        const respuesta = new MensajeModel();
        respuesta.mensaje = ['Se ha creado un pedido correctamente.'];
        respuesta.data = pedido_nuevo;
        return respuesta;
    }

    async updatePedido(id: number, pedidoDto: PedidoUpdateDto): Promise<MensajeModel> {
        const pedido = await this.pedidoRepository.findOne(id);

        if (!pedido) throw new NotFoundException('El pedido no existe.');

        const pedidoEditar = Object.assign(pedido, pedidoDto);
        const respuesta = new MensajeModel();
        respuesta.mensaje = ['Se ha actualizado correctamente.'];
        respuesta.data = await pedidoEditar.save();
        return respuesta;
    }
}
