import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MensajeModel } from 'src/models/mensaje.model';
import { Paginate } from 'src/models/paginate';
import { Pedido } from 'src/modules/repair/pedido/entity/pedido.entity';
import { Connection, getRepository, Repository } from 'typeorm';
import { ArticuloEntity } from '../../articulo/entity/articulo.entity';
import { CreateVentaDto } from '../dto/create-venta.dto';
import { UpdateVentaDto } from '../dto/update-venta.dto';
import { VentaEntity } from '../entity/venta.entity';


@Injectable()
export class VentaService {
  constructor(
    @InjectRepository(VentaEntity)
    private readonly ventaRepository: Repository<VentaEntity>,
    private connection: Connection,
) { }

async paginate(page: number,limit: number,search: string, field: string, order: number, idTaller: number,filtro_fecha: string,fechai:string,fechaf:string): Promise<Paginate> {
  const orderby = order == 1 ? 'ASC' : 'DESC';
  
  let idtaller: number = Number(idTaller);
  let paramns: any[] = [idtaller];

  let offset = (page - 1) * limit;
  let query_orderBy = '';
  let query_from = '';
  let query_taller = '';  
  let query_search = '';
  let query_filtro_fecha = '';
  let query_filtroentre_fecha = '';


  let query_select_count = `select count(v.idVenta) as count_total `;
  let query = `select v.idVenta,a.idTaller,v.idUsuario,v.cantidadVendida,v.created_at,v.precioVentaFinal,a.nombre `;
  query_taller = `WHERE a.idTaller = ?  `;
  query_from = `FROM venta as v INNER JOIN articulo as a on v.idArticulo = a.idArticulo `;
  
  query += query_from + query_taller;
  query_select_count += query_from + query_taller;
  
  if (search.length > 0) {
    let searchs = '%'+search+'%';    
    paramns.push(searchs);
    paramns.push(searchs);
    paramns.push(searchs);
    paramns.push(searchs);
    
    query_search = `AND (a.nombre LIKE ? OR v.created_at LIKE ? OR a.precio LIKE ? OR v.cantidadVendida LIKE ? )`;
    query += query_search;
    query_select_count += query_search;    
  }
  if(fechai.length > 0 && fechaf.length > 0) {
    paramns.push(fechai);
    paramns.push(fechaf);
    query_filtroentre_fecha = 'AND v.created_at >= ? AND v.created_at <= ? ';
    query += query_filtroentre_fecha;
    query_select_count += query_filtroentre_fecha;
  }
  if(filtro_fecha.length > 0) {           
           
    switch (filtro_fecha) {
      case 'today':
        let hoy = new Date();
        let formated_hoy = hoy.getFullYear()+"-"+(hoy.getMonth() + 1)+"-"+hoy.getDate();        
        paramns.push(formated_hoy);
        query_filtro_fecha = 'AND v.created_at = ?';
        break;
      case 'yesterday':
        let ayer = new Date();
        ayer.setDate(ayer.getDate() - 1);
        let formated_ayer = ayer.getFullYear()+"-"+(ayer.getMonth() + 1)+"-"+ayer.getDate();
        paramns.push(formated_ayer);
        query_filtro_fecha = 'AND v.created_at = ?';
        break;
      case 'lastweek':
        let lastweek = new Date();
        lastweek.setDate(lastweek.getDate() - lastweek.getDay());
        let formated_lastweek = lastweek.getFullYear()+"-"+(lastweek.getMonth() + 1)+"-"+lastweek.getDate();
        paramns.push(formated_lastweek);
        query_filtro_fecha = 'AND v.created_at >= ?';
        break;
      case 'lastmonth':
        let lastmonth = new Date();
        lastmonth.setDate(1);
        let formated_lastmonth = lastmonth.getFullYear()+"-"+(lastmonth.getMonth() + 1)+"-"+lastmonth.getDate();
        paramns.push(formated_lastmonth);
        query_filtro_fecha = 'AND v.created_at >= ?';
        break;
      case 'betweendate':
        let fecha_inicial = new Date();
        lastmonth.setDate(lastmonth.getDate() - 30);
        paramns.push(lastmonth.toLocaleDateString('sv-SE'));
        query_filtro_fecha = 'AND v.created_at >= ?';
        break;
      default:
        break;
    }
    query += query_filtro_fecha;
    query_select_count += query_filtro_fecha;

}
  query_orderBy = ` ORDER BY v.` + field + ` ` +  orderby;
  query += query_orderBy;
  query_select_count += query_orderBy;
  let query_complete = query;
  query += ` LIMIT ` + offset + `,` + limit;
  
  const count = await this.ventaRepository.query(query_select_count,paramns);
  const queryBuilder =await this.ventaRepository.query(query,paramns);
  const result_complete =await this.ventaRepository.query(query_complete,paramns);

 
  return {
    data: queryBuilder,
    datac:result_complete,
    count: +count[0].count_total
  }
}

  async create(createVentaDto: CreateVentaDto):Promise<MensajeModel>  {
    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {

      const {cantidadVendida,idArticulo,idUsuario,idTaller,nombre,estado,precioVentaFinal} = createVentaDto;

      const repositorioArticulo =  getRepository<ArticuloEntity>(ArticuloEntity);

      const articulo = await repositorioArticulo.findOne(idArticulo);

      if(cantidadVendida > articulo.stock) {
        throw new HttpException('La cantidad vendida excede la cantidad disponible.',HttpStatus.CONFLICT);
      }
      articulo.stock = articulo.stock - Number(cantidadVendida);
      await queryRunner.manager.save(articulo);

      const nueva_venta = new VentaEntity();
      nueva_venta.cantidadVendida = cantidadVendida;
      nueva_venta.idArticulo = idArticulo;
      nueva_venta.idUsuario = idUsuario;
      nueva_venta.precioVentaFinal = precioVentaFinal;
      nueva_venta.created_at = new Date();
      await queryRunner.manager.save(nueva_venta);

      const nuevo_pedido = new Pedido();
      nuevo_pedido.idTaller = idTaller;
      nuevo_pedido.pedido = nombre;
      nuevo_pedido.nota = 'Cantidad:' + cantidadVendida.toString();
      nuevo_pedido.fecha = new Date();
      nuevo_pedido.estado = estado;
      await queryRunner.manager.save(nuevo_pedido);      

      await queryRunner.commitTransaction();
      
      const respuesta = new MensajeModel();
      respuesta.mensaje = ['La venta se ha realizado correctamente.','Se ha creado un pedido.'];
      respuesta.data = nueva_venta;
      return respuesta;
      
    } catch (error) {
      await queryRunner.rollbackTransaction();
      const errorResponse = {
        timestamp: new Date().toLocaleString(),
        message: 'La venta no se realizó correctamente.',
        exception: error,       
      };
      throw new HttpException(errorResponse,HttpStatus.BAD_REQUEST);
    }
  }

  async findAll(search: string, field: string, order: number, idTaller: number,filtro_fecha: string): Promise<{data:any[]}> {
    let idtaller: number = Number(idTaller);
    let paramns: any[] = [idtaller];
    let query = `select v.idVenta,a.idTaller,v.idUsuario,v.cantidadVendida,v.created_at,a.precio,a.nombre FROM venta as v INNER JOIN articulo as a on v.idArticulo = a.idArticulo WHERE a.idTaller = ?`;

    const queryBuilder =await this.ventaRepository.query(query,paramns);

    return {
      data:queryBuilder
    }
  }

 async findOne(id: number): Promise<MensajeModel>  {
  try {
    const found_venta = await this.ventaRepository.findOne(id)
    if (!found_venta) {
        throw new NotFoundException(`Venta con ID "${id}" no encontrada.`)
    }

    const respuesta = new MensajeModel();
    respuesta.mensaje = ['Se ha encontrado una coincidencia.'];
    respuesta.data = found_venta;
    return respuesta;
   } catch (error) {
    const errorResponse = {
      timestamp: new Date().toLocaleString(),
      message: 'No se encontraron resultados.',
      exception: error,       
    };
    throw new HttpException(errorResponse,HttpStatus.BAD_REQUEST);
   }
  }

  async update(id: number, updateVentaDto: UpdateVentaDto): Promise<MensajeModel>  {
    try {
      const venta = await this.ventaRepository.findOne(id);

      if (!venta) throw new NotFoundException('Esta venta no existe.');

      const articuloEditar = Object.assign(venta, updateVentaDto);

      const respuesta = new MensajeModel();
      respuesta.mensaje = ['Se ha actualizado correctamente.'];
      respuesta.data = await this.ventaRepository.save(articuloEditar);
      return respuesta;
    } catch (error) {
      const errorResponse = {
        timestamp: new Date().toLocaleString(),
        message: 'La venta  no se pudo actualizar.',
        exception: error,       
      };
      throw new HttpException(errorResponse,HttpStatus.BAD_REQUEST);
    }
  }

  async remove(id: number): Promise<MensajeModel> {
    try {
      const result = await this.ventaRepository.delete(id);
      if (result.affected === 0) {
          throw new NotFoundException(`Venta con ID "${id}" no encontrada.`);
      }
  
      const respuesta = new MensajeModel();
      respuesta.mensaje = ['Se ha eliminado correctamente.'];
      return respuesta;
     } catch (error) {
      const errorResponse = {
        timestamp: new Date().toLocaleString(),
        message: 'La venta no se pudo eliminar.',
        exception: error,       
      };
      throw new HttpException(errorResponse,HttpStatus.BAD_REQUEST);
     }
  }
}
