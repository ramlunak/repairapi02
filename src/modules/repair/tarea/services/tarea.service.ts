import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';
import { MensajeModel } from 'src/models/mensaje.model';
import { Paginate } from 'src/models/paginate';
import { UserEntity } from 'src/modules/auth/entity/user.entity';
import { Brackets, getRepository, Repository } from 'typeorm';
import { Dispositivo } from '../../dispositivo/entity/dispositivo.entity';
import { MarcaEntity } from '../../marca/entity/marca.entity';
import { ModeloEntity } from '../../modelo/entity/modelo.entity';
import { OrdenEntity } from '../../orden/entity/orden.entity';
import { TareaCrearDto } from '../dtos/tarea.crear.dto';
import { TareaEstadoDto } from '../dtos/tarea.estado.dto';
import { TareaFiltroDto } from '../dtos/tarea.filtro.dto';
import { TareaUpdateDto } from '../dtos/tarea.update.dto';
import { Tarea } from '../entity/tarea.entity';

@Injectable()
export class TareaService {
    constructor(
        @InjectRepository(Tarea)
        private readonly tareaRepository: Repository<Tarea>
    ) { }

    async getAll(): Promise<Tarea[]> {
        return await this.tareaRepository.find({relations: ['orden']});
    }

    async getTareaPorOrden(idOrden:number): Promise<Tarea[]> {
        return await this.tareaRepository.find({
            where : {
                idOrden: idOrden
            },
            select:['tarea','estado','fechaLimite', 'idUsuario', 'fecha', 'nota','asignadaA']
            
        });
    }

    async countPorEstado(idTaller: number): Promise<Tarea[]> {
        let idtaller: number = Number(idTaller);
        const query = this.tareaRepository.createQueryBuilder('tarea');
        query.where('tarea.idTaller = :idtaller',{idtaller})   
        query.select('tarea.estado as estado')
        query.addSelect('COUNT(*) estadocount')
        query.groupBy('tarea.estado')
        const result = await query.getRawMany()
    
        return result;
    
    }

    async paginate(options: IPaginationOptions, search: string, field: string, order: number,idTaller: number,estado: number): Promise<Pagination<Tarea>> {
        const orderby = order == 1 ? 'ASC' : 'DESC';
        let idtaller: number = Number(idTaller);
        let estado_filter: number = Number(estado);
        const queryBuilder = this.tareaRepository.createQueryBuilder('tarea');
        queryBuilder.select(['tarea.idTarea','tarea.idTaller','tarea.tarea','tarea.nota','tarea.fecha','tarea.fechaLimite','tarea.idOrden','tarea.estado','tarea.idUsuario','tarea.asignadaA']) 
        queryBuilder.innerJoin(UserEntity,'seg_usuario','seg_usuario.id = tarea.idUsuario')        
        queryBuilder.addSelect('seg_usuario.username')
        queryBuilder.andWhere(new Brackets(qb=>{
            qb.where('tarea.tarea LIKE :search', { search: `%${search}%` })
            .orWhere('tarea.nota LIKE :search', { search: `%${search}%` })
            .orWhere('tarea.fecha LIKE :search', { search: `%${search}%` })
            .orWhere('tarea.fechaLimite LIKE :search', { search: `%${search}%` });
        }))
        if(estado_filter > 0){
            queryBuilder.andWhere('tarea.estado = :estado',{estado:estado_filter})
          }     
        queryBuilder.andWhere('tarea.idTaller = :idtaller', {idtaller})
        
        queryBuilder.orderBy('tarea.' + field, orderby);
         // Or whatever you need to do
          
        return paginate<Tarea>(queryBuilder, options);
    }

    async getTareaPaginado(page: number,limit: number,search: string, field: string, order: number, idTaller: number,estado:number,filtro_fecha:string,fechai:string,fechaf:string): Promise<Paginate> {
        const orderby = order == 1 ? 'ASC' : 'DESC';
        let estado_filter: number = Number(estado);
        let idtaller: number = Number(idTaller);
        let paramns: any[] = [idtaller];
      
        let offset = (page - 1) * limit;
        let query_orderBy = '';
        let query_from = '';
        let query_taller = '';
        let query_estado = '';
        let query_search = '';
        let query_filtro_fecha = '';
        let query_filtroentre_fecha = '';
      
      
        let query_select_count = `select count(t.idTarea) as count_total `;
        let query = `select t.idTarea,t.idTaller,t.tarea,t.nota,t.fecha,t.fechaLimite,t.idOrden,t.estado,t.idUsuario,t.asignadaA,su.username,o.pin,o.patron `;
        query_taller = `WHERE t.idTaller = ?  `;
        query_from = `FROM tarea as t INNER JOIN seg_usuario as su on t.idUsuario = su.id LEFT JOIN orden as o on t.idOrden = o.idOrden `;
        
        query += query_from + query_taller;
        query_select_count += query_from + query_taller;
      
        if(estado_filter > 0){
          paramns.push(estado_filter);
          query_estado = `AND t.estado = ? `;
          query += query_estado;
          query_select_count += query_estado;
        }
        if(fechai.length > 0 && fechaf.length > 0) {
            paramns.push(fechai);
            paramns.push(fechaf);
            query_filtroentre_fecha = 'AND t.fecha >= ? AND t.fecha <= ? ';
            query += query_filtroentre_fecha;
            query_select_count += query_filtroentre_fecha;
          }
        if (search.length > 0) {
          let searchs = '%'+search+'%';    
          paramns.push(searchs);
          paramns.push(searchs);
          paramns.push(searchs);
          paramns.push(searchs);
          paramns.push(searchs);
          paramns.push(searchs);
          paramns.push(searchs);
          paramns.push(searchs);
          paramns.push(searchs);
          paramns.push(searchs);
          query_search = `AND (o.patron LIKE ? OR o.pin LIKE ? OR t.asignadaA LIKE ? OR t.nota LIKE ? OR t.tarea LIKE ? OR t.nota LIKE ? OR t.fecha LIKE ? OR t.fechaLimite LIKE ? OR su.username LIKE ? OR t.idOrden LIKE ?)`;
          query += query_search;
          query_select_count += query_search;    
        }
        if(filtro_fecha.length > 0) {           
           
            switch (filtro_fecha) {
              case 'today':
                let hoy = new Date();
                paramns.push(hoy.toLocaleDateString('sv-SE'));
                query_filtro_fecha = 'AND t.fecha = ?';
                break;
              case 'yesterday':
                let ayer = new Date();
                ayer.setDate(ayer.getDate() - 1);
                paramns.push(ayer.toLocaleDateString('sv-SE'));
                query_filtro_fecha = 'AND t.fecha = ?';
                break;
              case 'lastweek':
                let lastweek = new Date();
                lastweek.setDate(lastweek.getDate() - lastweek.getDay());                
                paramns.push(lastweek.toLocaleDateString('sv-SE'));
                query_filtro_fecha = 'AND t.fecha >= ?';
                break;
              case 'lastmonth':
                let lastmonth = new Date();
                lastmonth.setDate(1);
                paramns.push(lastmonth.toLocaleDateString('sv-SE'));
                query_filtro_fecha = 'AND t.fecha >= ?';
                break;
              default:
                break;
            }
            query += query_filtro_fecha;
            query_select_count += query_filtro_fecha;

        }
        switch (field) {
            case 'tarea':
              query_orderBy = ` ORDER BY t.tarea` + ` ` + orderby;
              break; 
            case 'idOrden':
                query_orderBy = ` ORDER BY o.idOrden` + ` ` + orderby;
                break;   
            case 'fecha':
                query_orderBy = ` ORDER BY t.` + field + ` ` + orderby;
                break;

            case 'fechaLimite':
                query_orderBy = ` ORDER BY t.` + field + ` ` + orderby;
                break;

            case 'idUsuario':
                query_orderBy = ` ORDER BY t.` + field + ` ` + orderby;
                break;

            case 'estado':
                query_orderBy = ` ORDER BY t.` + field + ` ` + orderby;
                break;   

            case 'asignadaA':
                query_orderBy = ` ORDER BY t.` + field + ` ` + orderby;
                break;
                             
                
            default:
              query_orderBy = ` ORDER BY t.estado ASC`  +  ` , t.fecha ASC` ;
              break;
          }
        query += query_orderBy;
        query_select_count += query_orderBy;
        query += ` LIMIT ` + offset + `,` + limit;
        
        const count = await this.tareaRepository.query(query_select_count,paramns);
        const queryBuilder =await this.tareaRepository.query(query,paramns);
       
        return {
          data: queryBuilder,
          count: +count[0].count_total
        }
      }

    async findOnTarea(id: number): Promise<MensajeModel> {
        const found_tarea = await this.tareaRepository.findOne(id)
        if (!found_tarea) {
            throw new NotFoundException(`La tarea con ID "${id}" no se ha encontrado.`)
        }

        const respuesta = new MensajeModel();
        respuesta.mensaje = ['Se ha encontrado una coincidencia.'];
        respuesta.data = found_tarea;
        return respuesta;
    }

    async deleteTarea(id: number): Promise<MensajeModel> {
        const result = await this.tareaRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`La tarea con ID "${id}" no se ha encontrado.`);
        }

        const respuesta = new MensajeModel();
        respuesta.mensaje = ['Se ha eliminado correctamente.'];
        return respuesta;
    }

  

    async saveTarea(tareaDto: TareaCrearDto): Promise<MensajeModel> {
        //const tarea = await this.tareaRepository.save(tareaDto);
        const { tarea, nota, idTaller, idOrden, idUsuario, fechaLimite,asignadaA } = tareaDto;
        
       /* let fecha_limite = new Date();
        fecha_limite.setDate(fecha_limite.getDate()+1);*/

        let new_tarea = new Tarea();
        new_tarea.tarea = tarea;
        new_tarea.idTaller = idTaller;
        new_tarea.idOrden = idOrden;
        new_tarea.idUsuario = idUsuario;
        new_tarea.asignadaA = asignadaA;
        new_tarea.fecha = new Date();
        new_tarea.fechaLimite = new Date(fechaLimite);
        if (idOrden > 0) {
            const repositoryOrden = getRepository<OrdenEntity>(OrdenEntity);
            const repositoryDispositivo = getRepository<Dispositivo>(Dispositivo);
            const repositoryMarca = getRepository<MarcaEntity>(MarcaEntity);
            const repositoryModelo = getRepository<ModeloEntity>(ModeloEntity);
            const orden = await repositoryOrden.findOne(idOrden);
            const dispositivo = await repositoryDispositivo.findOne(orden.idDispositivo);
            const marca = await repositoryMarca.findOne(orden.idMarca);
            const modelo = await repositoryModelo.findOne(orden.idModelo);
            new_tarea.nota = dispositivo.dispositivo + '-' + marca.marca + '-' + modelo.modelo;
        } else {
            new_tarea.nota = nota;
        }        
        new_tarea.estado = 1;
        await new_tarea.save();
        if (!new_tarea) {
            throw new NotFoundException(`La tarea no se ha insertado.`)
        }
        const respuesta = new MensajeModel();
        respuesta.mensaje = ['La tarea ha sido creada correctamente.'];
        respuesta.data = new_tarea;
        return respuesta;

    }

    async updateEstado(id: number, estadoUpdate: TareaCrearDto): Promise<MensajeModel> { 

        const find_tarea = await this.tareaRepository.findOne(id,{relations: ['orden']})

        if (!find_tarea) throw new NotFoundException('Esta tarea no existe.');

        const { estado } = estadoUpdate;
        const orden = find_tarea.orden;
        if(orden) {
            const tareasPorOrden =await this.getTareaPorOrden(orden.idOrden);

            if (tareasPorOrden.length === 1) {
                orden.estado = estado;
                await orden.save();
            }
        }
        find_tarea.estado = estado;
        const respuesta = new MensajeModel();
        respuesta.mensaje = ['Se ha actualizado correctamente.'];
        respuesta.data = await find_tarea.save();
        return respuesta;
    }

    async updateTarea(id: number, tareaDto: TareaUpdateDto): Promise<MensajeModel> {

        const find_tarea = await this.tareaRepository.findOne(id)
        if (!find_tarea) throw new NotFoundException('Esta tarea no existe.');
        tareaDto.fechaLimite =  new Date(tareaDto.fechaLimite)
        const tareaEditar = Object.assign(find_tarea, tareaDto);

        const respuesta = new MensajeModel();
        respuesta.mensaje = ['Se ha actualizado correctamente.'];
        respuesta.data = await tareaEditar.save();
        return respuesta;
    }
}
