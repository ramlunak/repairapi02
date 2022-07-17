import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MensajeModel } from 'src/models/mensaje.model';
import { Paginate } from 'src/models/paginate';
import { Connection, Repository } from 'typeorm';
import { CreateCompraDto } from '../dto/create-compra.dto';
import { UpdateCompraDto } from '../dto/update-compra.dto';
import { CompraEntity } from '../entity/compra.entity';


@Injectable()
export class CompraService {

  constructor(
    @InjectRepository(CompraEntity)
    private readonly compraRepository: Repository<CompraEntity>,
    private connection: Connection,
) { }

  async create(createCompraDto: CreateCompraDto): Promise<MensajeModel> {
   try {
    const {cantidad,idArticulo,idUsuario,idTaller,precioCompra} = createCompraDto;

    const nueva_compra = new CompraEntity();
    nueva_compra.idArticulo = idArticulo;
    nueva_compra.cantidad = Number(cantidad);
    nueva_compra.idTaller = idTaller;
    nueva_compra.idUsuario = idUsuario;
    nueva_compra.precioCompra = precioCompra;
    nueva_compra.created_at = new Date();
    await nueva_compra.save();

    if (!nueva_compra) {
      throw new NotFoundException(`La compra no fue registrada.`)
    }    

    const respuesta = new MensajeModel();
    respuesta.mensaje = ['La venta se ha realizado correctamente.','Se ha creado un pedido.'];
   
    return respuesta;
    
     
   } catch (error) {
    const errorResponse = {
      timestamp: new Date().toLocaleString(),
      message: 'No se encontraron resultados de compras.',
      exception: error,       
    };
    throw new HttpException(errorResponse,HttpStatus.BAD_REQUEST);
   }
  }

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
  
  
    let query_select_count = `select count(c.idCompra) as count_total `;
    let query = `select c.idCompra,a.idTaller,c.idUsuario,c.cantidad,c.created_at,c.precioCompra,a.nombre `;
    query_taller = `WHERE c.idTaller = ?  `;
    query_from = `FROM compra as c INNER JOIN articulo as a on c.idArticulo = a.idArticulo INNER JOIN seg_usuario as su ON su.id = c.idUsuario `;
    
    query += query_from + query_taller;
    query_select_count += query_from + query_taller;
    
    if (search.length > 0) {
      let searchs = '%'+search+'%';    
      paramns.push(searchs);
      paramns.push(searchs);
      paramns.push(searchs);
      paramns.push(searchs);
      
      
      query_search = `AND (a.nombre LIKE ? OR c.precioCompra LIKE ? OR c.cantidad LIKE ? OR su.username LIKE ? )`;
      query += query_search;
      query_select_count += query_search;    
    }
    if(fechai.length > 0 && fechaf.length > 0) {
      paramns.push(fechai);
      paramns.push(fechaf);
      query_filtroentre_fecha = 'AND c.created_at >= ? AND c.created_at <= ? ';
      query += query_filtroentre_fecha;
      query_select_count += query_filtroentre_fecha;
    }
    if(filtro_fecha.length > 0) {           
             
      switch (filtro_fecha) {
        case 'today':
          let hoy = new Date();
          let formated_hoy = hoy.getFullYear()+"-"+(hoy.getMonth() + 1)+"-"+hoy.getDate();        
          paramns.push(formated_hoy);
          query_filtro_fecha = 'AND c.created_at = ?';
          break;
        case 'yesterday':
          let ayer = new Date();
          ayer.setDate(ayer.getDate() - 1);
          let formated_ayer = ayer.getFullYear()+"-"+(ayer.getMonth() + 1)+"-"+ayer.getDate();
          paramns.push(formated_ayer);
          query_filtro_fecha = 'AND c.created_at = ?';
          break;
        case 'lastweek':
          let lastweek = new Date();
          lastweek.setDate(lastweek.getDate()  - lastweek.getDay());
          let formated_lastweek = lastweek.getFullYear()+"-"+(lastweek.getMonth() + 1)+"-"+lastweek.getDate();
          paramns.push(formated_lastweek);
          query_filtro_fecha = 'AND c.created_at >= ?';
          break;
        case 'lastmonth':
          let lastmonth = new Date();
          lastmonth.setDate(1);
          let formated_lastmonth = lastmonth.getFullYear()+"-"+(lastmonth.getMonth() + 1)+"-"+lastmonth.getDate();
          paramns.push(formated_lastmonth);
          query_filtro_fecha = 'AND c.created_at >= ?';
          break;
        case 'betweendate':
          let fecha_inicial = new Date();
          lastmonth.setDate(lastmonth.getDate() - 30);
          paramns.push(lastmonth.toLocaleDateString('sv-SE'));
          query_filtro_fecha = 'AND c.created_at >= ?';
          break;
        default:
          break;
      }
      query += query_filtro_fecha;
      query_select_count += query_filtro_fecha;
  
  }

    switch (field) {
      case 'nombre':
        query_orderBy = ` ORDER BY a.` + field + ` ` + orderby;
        break;      
      default:
        query_orderBy = ` ORDER BY c.` + field + ` ` + orderby;
        break;
    }

   
    query += query_orderBy;
    query_select_count += query_orderBy;
    let query_complete = query;
    query += ` LIMIT ` + offset + `,` + limit;
    
    const count = await this.compraRepository.query(query_select_count,paramns);
    const queryBuilder =await this.compraRepository.query(query,paramns);
    const result_complete =await this.compraRepository.query(query_complete,paramns);
  
   
    return {
      data: queryBuilder,
      datac:result_complete,
      count: +count[0].count_total
    }
  }

  async findAll(search: string, field: string, order: number, idTaller: number,filtro_fecha: string) : Promise<{data:any[]}> {
    let idtaller: number = Number(idTaller);
    let paramns: any[] = [idtaller];
    let query = `select c.idCompora,a.idTaller,c.idUsuario,c.cantidad,c.created_at,c.precioCompra,a.nombre FROM compra as c INNER JOIN articulo as a on c.idArticulo = a.idArticulo WHERE a.idTaller = ?`;

    const queryBuilder =await this.compraRepository.query(query,paramns);

    return {
      data:queryBuilder
    }
  }

  async findOne(id: number): Promise<MensajeModel>  {
    try {
      const found_compra = await this.compraRepository.findOne(id)
      if (!found_compra) {
          throw new NotFoundException(`Compra con ID "${id}" no encontrada.`)
      }
  
      const respuesta = new MensajeModel();
      respuesta.mensaje = ['Se ha encontrado una coincidencia.'];
      respuesta.data = found_compra;
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

  async update(id: number, updateCompraDto: UpdateCompraDto): Promise<MensajeModel>   {
    try {
      const compra = await this.compraRepository.findOne(id);

      if (!compra) throw new NotFoundException('Esta compra no existe.');

      const articuloEditar = Object.assign(compra, updateCompraDto);

      const respuesta = new MensajeModel();
      respuesta.mensaje = ['Se ha actualizado correctamente.'];
      respuesta.data = await this.compraRepository.save(articuloEditar);
      return respuesta;
    } catch (error) {
      const errorResponse = {
        timestamp: new Date().toLocaleString(),
        message: 'La compra  no se pudo actualizar.',
        exception: error,       
      };
      throw new HttpException(errorResponse,HttpStatus.BAD_REQUEST);
    }
  }

  async remove(id: number) : Promise<MensajeModel> {
    try {
      const result = await this.compraRepository.delete(id);
      if (result.affected === 0) {
          throw new NotFoundException(`Compra con ID "${id}" no encontrada.`);
      }
  
      const respuesta = new MensajeModel();
      respuesta.mensaje = ['La compra se ha eliminado correctamente.'];
      return respuesta;
     } catch (error) {
      const errorResponse = {
        timestamp: new Date().toLocaleString(),
        message: 'La compra no se pudo eliminar.',
        exception: error,       
      };
      throw new HttpException(errorResponse,HttpStatus.BAD_REQUEST);
     }
  }
}
