import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';
import { MensajeModel } from 'src/models/mensaje.model';
import { Brackets, getRepository, Repository } from 'typeorm';
import { CompraEntity } from '../../compra/entity/compra.entity';
import { AddcantidadArticuloDto } from '../dto/addcantidad-articulo';
import { CreateArticuloDto } from '../dto/create-articulo.dto';
import { UpdateArticuloDto } from '../dto/update-articulo.dto';
import { ArticuloEntity } from '../entity/articulo.entity';

@Injectable()
export class ArticuloService {
  constructor(
    @InjectRepository(ArticuloEntity)
    private readonly articuloRepository: Repository<ArticuloEntity>,
  ) {}

   async create(createArticuloDto: CreateArticuloDto):Promise<MensajeModel> {

    try {
      const { idTaller, nombre,precio,stock,precioCompra,idUsuario } = createArticuloDto;
      const nuevo_articulo = new ArticuloEntity();
      nuevo_articulo.idTaller = idTaller;
      nuevo_articulo.nombre = nombre;
      nuevo_articulo.precio = precio;
      nuevo_articulo.stock = stock;
      await nuevo_articulo.save();
      if (!nuevo_articulo) {
        throw new NotFoundException(`El artículo no ha sido creado.`)
      }

      const compra = new CompraEntity();
      compra.idArticulo = nuevo_articulo.idArticulo;
      compra.cantidad = stock;
      compra.idTaller = idTaller;
      compra.idUsuario = idUsuario;
      compra.precioCompra = precioCompra;
      compra.created_at = new Date();
      await compra.save();
      if (!compra) {
        throw new NotFoundException(`La compra no se registró.`)
      }
      
      const respuesta = new MensajeModel();
      respuesta.mensaje = ['El artículo se ha creado correctamente.', 'La compra se registró correctamente.'];
      respuesta.data = nuevo_articulo;
      return respuesta;
      
    } catch (error) {
      const errorResponse = {
        timestamp: new Date().toLocaleString(),
        message: 'El artículo no ha sido creado.',
        exception: error,       
      };
      throw new HttpException(errorResponse,HttpStatus.BAD_REQUEST);
    }
   
   }

  async findAll(): Promise<ArticuloEntity[]> {
    return await this.articuloRepository.find();
  }

  async findOne(id: number): Promise<MensajeModel> {
       try {
        const found_articulo = await this.articuloRepository.findOne(id)
        if (!found_articulo) {
            throw new NotFoundException(`Artículo con ID "${id}" no encontrado.`)
        }

        const respuesta = new MensajeModel();
        respuesta.mensaje = ['Se ha encontrado una coincidencia.'];
        respuesta.data = found_articulo;
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
  async paginate(options: IPaginationOptions, search: string, field: string, order: number,idTaller: number): Promise<Pagination<ArticuloEntity>> {
    const orderby = order == 1 ? 'ASC' : 'DESC';
    let idtaller: number = Number(idTaller);
    const queryBuilder = this.articuloRepository.createQueryBuilder('articulo');
      
    queryBuilder.where('articulo.idTaller = :idtaller', { idtaller })
    queryBuilder.andWhere(new Brackets(qb => {
        qb.where('articulo.stock LIKE :search', {search: `%${search}%`})
        .orWhere('articulo.precio LIKE :search', {search: `%${search}%`})
        .orWhere('articulo.nombre LIKE :search', {search: `%${search}%`});
        
    }))       
    queryBuilder.orderBy(field, orderby);
    
    return paginate<ArticuloEntity>(queryBuilder, options);
}

async addCantidad(id: number, addCantidadArticuloDto: AddcantidadArticuloDto): Promise<MensajeModel> {
  try {
    const articulo = await this.articuloRepository.findOne(id);

    const repositoryCompra = getRepository<CompraEntity>(CompraEntity);

    if (!articulo) throw new NotFoundException('Este artículo no existe.');

   

    const {cantidad,idUsuario,precioCompra} = addCantidadArticuloDto;
    articulo.stock = articulo.stock + Number(cantidad);

    const nueva_compra = new CompraEntity();
    nueva_compra.idArticulo = articulo.idArticulo;
    nueva_compra.cantidad = Number(cantidad);
    nueva_compra.idTaller = articulo.idTaller;
    nueva_compra.idUsuario = idUsuario;
    nueva_compra.precioCompra = precioCompra;
    nueva_compra.created_at = new Date();
    await nueva_compra.save();
    if (!nueva_compra) {
      throw new NotFoundException(`La compra no se registró.`)
    }


    const respuesta = new MensajeModel();
    respuesta.mensaje = ['Se ha actualizado el stock del artículo correctamente','La compra se registró correctamente'];
    respuesta.data = await this.articuloRepository.save(articulo);
    return respuesta;
  } catch (error) {
    const errorResponse = {
      timestamp: new Date().toLocaleString(),
      message: 'El artículo no se pudo actualizar.',
      exception: error,       
    };
    throw new HttpException(errorResponse,HttpStatus.BAD_REQUEST);
  }
}


  async update(id: number, updateArticuloDto: UpdateArticuloDto): Promise<MensajeModel> {
    try {
      const articulo = await this.articuloRepository.findOne(id);
      const {nombre,precio} = updateArticuloDto;

      if (!articulo) throw new NotFoundException('Este artículo no existe.');

      articulo.nombre = nombre;
      articulo.precio = precio;

      const respuesta = new MensajeModel();
      respuesta.mensaje = ['Se ha actualizado correctamente.'];
      respuesta.data = await this.articuloRepository.save(articulo);
      return respuesta;
    } catch (error) {
      const errorResponse = {
        timestamp: new Date().toLocaleString(),
        message: 'El artículo no se pudo actualizar.',
        exception: error,       
      };
      throw new HttpException(errorResponse,HttpStatus.BAD_REQUEST);
    }
  }

  async remove(id: number): Promise<MensajeModel> {
   try {
    const result = await this.articuloRepository.delete(id);
    if (result.affected === 0) {
        throw new NotFoundException(`Artículo con ID "${id}" no encontrado.`);
    }

    const respuesta = new MensajeModel();
    respuesta.mensaje = ['Se ha eliminado correctamente.'];
    return respuesta;
   } catch (error) {
    const errorResponse = {
      timestamp: new Date().toLocaleString(),
      message: 'El artículo no se pudo eliminar.',
      exception: error,       
    };
    throw new HttpException(errorResponse,HttpStatus.BAD_REQUEST);
   }
  }
}
