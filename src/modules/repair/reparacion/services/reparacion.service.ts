import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MensajeModel } from 'src/models/mensaje.model';
import { Connection, Equal, getRepository, Not, Repository } from 'typeorm';
import { Imagen } from '../../imagen/entity/imagen.entity';
import { MarcaEntity } from '../../marca/entity/marca.entity';
import { ModeloReparacion } from '../../modelo/entity/modelo-reparacion';
import { ModeloEntity } from '../../modelo/entity/modelo.entity';
import { ReparacionCrearDto } from '../dtos/reparacion-crear.dto';
import { ReparacionUpdateDto } from '../dtos/reparacion-update.dto';
import { OrdenReparacion } from '../entity/orden-reparacion.entity';
import { ReparacionEntity } from '../entity/reparacion.entity';

@Injectable()
export class ReparacionService {
  constructor(
    @InjectRepository(ReparacionEntity)
    private readonly reparacionRepository: Repository<ReparacionEntity>,
    private connection: Connection,
  ) { }

  async getReparacionAsignadas(idModelo: number): Promise<MensajeModel> {
    const repository_dispositivo_reparacion = getRepository<ModeloReparacion>(ModeloReparacion);

    const query = repository_dispositivo_reparacion.createQueryBuilder('modelo_reparacion');
    query.where('modelo_reparacion.idModelo = :idModelo', { idModelo });
    const modelo_reparacion = await query.getMany();

    const query_reparacion = this.reparacionRepository.createQueryBuilder('reparacion');
    const respuesta = new MensajeModel();
    if (modelo_reparacion.length > 0) {
      let id: number[] = [];

      modelo_reparacion.forEach((value, index) => {
        id.push(value.idReparacion);
      });
      query_reparacion.whereInIds(id);
      const found_reparacion = await query_reparacion.getMany();
      if (found_reparacion.length == 0) {
        throw new NotFoundException(`No se encontraron tipos de reparaciones.`);
      }

      respuesta.mensaje = ['Se han encontrado resultados.'];
      respuesta.data = found_reparacion;
      return respuesta;
    } else {
      respuesta.mensaje = ['No se encontraron resultados.'];
      respuesta.data = [];
      return respuesta;
    }
  }

  async getAll(): Promise<ReparacionEntity[]> {
    const found_reparacion = await this.reparacionRepository.find();
    if (!found_reparacion) {
      throw new NotFoundException(`No existen tipos de reparaciones.`);
    }
    return found_reparacion;
  }

  async findOnReparacion(id: number): Promise<MensajeModel> {
    const found_reparacion = await this.reparacionRepository.findOne(id);
    if (!found_reparacion) {
      throw new NotFoundException(
        `La reparación con ID "${id}" no se ha encontrado.`,
      );
    }

    const respuesta = new MensajeModel();
    respuesta.mensaje = ['Se ha encontrado una coincidencia.'];
    respuesta.data = found_reparacion;
    return respuesta;
  }

  async findReparacionOnOrden(idOrden: number): Promise<MensajeModel> {
    const repository_orden_reparacion = getRepository<OrdenReparacion>(OrdenReparacion);

    const query = repository_orden_reparacion.createQueryBuilder('orden_reparacion');
    query.where('orden_reparacion.idOrden = :idOrden', { idOrden });
    const orden_reparacion = await query.getMany();

    const idReparaciones = orden_reparacion.map((value) => {
      return value.idReparacion;
    })

    const reparaciones = await this.reparacionRepository.findByIds(idReparaciones)

    const respuesta = new MensajeModel();
    respuesta.mensaje = ['Se ha encontrado una coincidencia.'];
    respuesta.data = reparaciones;
    return respuesta;
  }

  //Esta funcion solo se llama despues de crear las relaciones de modelo y reparacion
  async conmodel(idModelo: number): Promise<MensajeModel> {
    const repository_modelo_reparacion = getRepository<ModeloReparacion>(ModeloReparacion);

    const query = repository_modelo_reparacion.createQueryBuilder('modelo_reparacion');
    query.where('modelo_reparacion.idModelo = :idModelo', { idModelo });
    const modelo_reparacion = await query.getMany();

    if (modelo_reparacion.length > 0) {
      let id = modelo_reparacion.map((value, index) => { return value.idReparacion; });

      const query_reparacion = this.reparacionRepository.createQueryBuilder('reparacion');
      query_reparacion.innerJoinAndMapOne('reparacion.modelo_reparacion', ModeloReparacion, 'modelo_reparacion', 'reparacion.idReparacion = modelo_reparacion.idReparacion and modelo_reparacion.idModelo =' + idModelo);
      query_reparacion.whereInIds(id);

      const found_reparacion = await query_reparacion.getMany();

      if (found_reparacion.length == 0) {
        throw new HttpException('No se encontraron reparaciones para este modelo.', HttpStatus.NOT_FOUND);
      }

      const respuesta = new MensajeModel();
      respuesta.mensaje = ['Se han encontrado resultados'];
      respuesta.data = found_reparacion;
      return respuesta;
    }
    else {
      throw new HttpException('No se pudo crear las relaciones de este modelo.', HttpStatus.NOT_FOUND);
    }
  }

  async findReparacionOnModelo(idModelo: number): Promise<MensajeModel> {
    const repository_modelo_reparacion = getRepository<ModeloReparacion>(ModeloReparacion);

    const query = repository_modelo_reparacion.createQueryBuilder('modelo_reparacion');
    query.where('modelo_reparacion.idModelo = :idModelo', { idModelo });
    const modelo_reparacion = await query.getMany();

    if (modelo_reparacion.length > 0) {
      let id = modelo_reparacion.map((value, index) => { return value.idReparacion; });

      const query_reparacion = this.reparacionRepository.createQueryBuilder('reparacion');
      query_reparacion.innerJoinAndMapOne('reparacion.modelo_reparacion', ModeloReparacion, 'modelo_reparacion', 'reparacion.idReparacion = modelo_reparacion.idReparacion and modelo_reparacion.idModelo =' + idModelo);
      query_reparacion.whereInIds(id);

      const found_reparacion = await query_reparacion.getMany();

      if (found_reparacion.length == 0) {
        throw new HttpException('No se encontraron reparaciones para este modelo.', HttpStatus.NOT_FOUND);
      }

      const respuesta = new MensajeModel();
      respuesta.mensaje = ['Se han encontrado resultados'];
      respuesta.data = found_reparacion;
      return respuesta;
    }
    else {

      try {
        await this.clonarModeloReparaciones(idModelo);
        return await this.conmodel(idModelo);
      } catch {
        throw new HttpException('No se pudo crear las relaciones de este modelo.', HttpStatus.NOT_FOUND);
      }

    }
  }

  async clonarModeloReparaciones(idModelo: number) {

    const modeloRepository = getRepository<ModeloEntity>(ModeloEntity);
    const reparacionRepository = getRepository<ReparacionEntity>(ReparacionEntity);

    let modelo = await modeloRepository.findOne(idModelo);
    let idDispositivo = modelo.idDispositivo;

    let queryReparaciones = reparacionRepository.createQueryBuilder('reparacion');

    queryReparaciones.where('reparacion.idDispositivo =:idDispositivo', { idDispositivo })

    let reparaciones = await queryReparaciones.getMany();

    await this.saveModeloReparaciones(reparaciones, idModelo);

  }


  async saveModeloReparacion(relacion: ModeloReparacion) {

    const repository_modelo_reparacion = getRepository<ModeloReparacion>(ModeloReparacion);

    return new Promise(async (resolved, rejected) => {
      let container = new ModeloReparacion();
      container.idModelo = relacion.idModelo;
      container.idReparacion = relacion.idReparacion;
      container.precio = 0;
      container.activo = true;
      let new_relacion = await repository_modelo_reparacion.save(container);
      resolved(new_relacion);
    });

  }

  async saveModeloReparaciones(reparaciones: ReparacionEntity[], idModelo: number) {

    for (const reparacion of reparaciones) {
      let relacion = new ModeloReparacion();
      relacion.idModelo = idModelo;
      relacion.idReparacion = reparacion.idReparacion;
      const res: any = await this.saveModeloReparacion(relacion);
    }

  }

  async deleteReparacion(idreparacion: number, idmodelo: number): Promise<MensajeModel> {

    const found_reparacion = await this.reparacionRepository.findOne(idreparacion);
    if (!found_reparacion) {
      throw new NotFoundException(
        `La reparación con id "${idreparacion}" no encontrado.`,
      );
    }
    const repository_modelo_reparacion = getRepository<ModeloReparacion>(ModeloReparacion);
    const query = repository_modelo_reparacion.createQueryBuilder('modelo_reparacion');
    query.where('modelo_reparacion.idReparacion = :idreparacion', { idreparacion });
    query.andWhere('modelo_reparacion.idModelo = :idmodelo', { idmodelo });
    const modelo_reparacion = await query.getMany();
    if (modelo_reparacion.length > 0) {
      await repository_modelo_reparacion.remove(modelo_reparacion);

      const query_found = repository_modelo_reparacion.createQueryBuilder('modelo_reparacion');
      query_found.where('modelo_reparacion.idReparacion = :idreparacion', { idreparacion });
      query_found.andWhere('modelo_reparacion.idModelo <> :idmodelo', { idmodelo });
      const modelo_reparacion_found = await query_found.getMany();

      if (modelo_reparacion_found.length <= 0) {
        const result = await this.reparacionRepository.delete(idreparacion);
        if (result.affected === 0) {
          throw new NotFoundException(
            `Tipo de reparación con id "${idreparacion}" no encontrado.`,
          );
        }
      }

      const respuesta = new MensajeModel();
      respuesta.mensaje = ['Se ha eliminado correctamente.'];
      return respuesta
    } else {
      const respuesta = new MensajeModel();
      respuesta.mensaje = ['No se ha podido eliminar.'];
      return respuesta
    }
  }

  async saveReparacion(crearReparacion: ReparacionCrearDto): Promise<MensajeModel> {
    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {

      const { reparacion, idTaller, imagen, activo, idModelo, idDispositivo } = crearReparacion;

      const newreparacion = new ReparacionEntity();
      newreparacion.reparacion = reparacion;
      newreparacion.idTaller = idTaller;
      newreparacion.idDispositivo = idDispositivo;
      newreparacion.imagen = imagen;
      await queryRunner.manager.save(newreparacion);
      if (!newreparacion) {
        throw new NotFoundException(`Reparación no insertada.`);
      }

      const modelo_reparacion = new ModeloReparacion();
      modelo_reparacion.idModelo = idModelo;
      modelo_reparacion.idReparacion = newreparacion.idReparacion;
      modelo_reparacion.precio = crearReparacion.precio;
      modelo_reparacion.activo = activo;
      await queryRunner.manager.save(modelo_reparacion);

      const repository_modelo = getRepository<ModeloEntity>(ModeloEntity);
      const repository_marca = getRepository<MarcaEntity>(MarcaEntity);

      const modelo = await repository_modelo.findOne(idModelo);

      //Clonar para los otros talleres
      //Buscar todos los modelos iguales en todos los talleres 
      let modelos_iguales = await repository_modelo.find({
        where: {
          modelo: Equal(modelo.modelo),
          idModelo: Not(`${idModelo}`)
        }
      });

      if (modelos_iguales.length > 0) {

        const modelo_reparacion_repository = getRepository<ModeloReparacion>(ModeloReparacion);

        for (const modelo of modelos_iguales) {

          let idModeloTaller = modelo.idModelo;
          let reparacionescreateQueryBuilder = modelo_reparacion_repository.createQueryBuilder('modelo_reparacion');
          reparacionescreateQueryBuilder.andWhere('modelo_reparacion.idModelo =:idModeloTaller', { idModeloTaller })
          let reparaciones = await reparacionescreateQueryBuilder.getMany();

          if (reparaciones.length == 0) {
            continue;
          } else {
            let marca = await repository_marca.findOne(modelo.idMarca);
            let newreparacion = new ReparacionEntity();
            newreparacion.reparacion = reparacion;
            newreparacion.idTaller = marca.idTaller;
            newreparacion.idDispositivo = modelo.idDispositivo;
            newreparacion.imagen = imagen;
            let reparacion_clonada = await queryRunner.manager.save(newreparacion);

            let repository_modelo_reparacion = new ModeloReparacion();
            repository_modelo_reparacion.idModelo = modelo.idModelo;
            repository_modelo_reparacion.idReparacion = reparacion_clonada.idReparacion;
            repository_modelo_reparacion.precio = crearReparacion.precio;
            repository_modelo_reparacion.activo = activo;
            await queryRunner.manager.save(repository_modelo_reparacion);
          }

        }

      }

      await queryRunner.commitTransaction();
      const respuesta = new MensajeModel();
      respuesta.mensaje = ['La reparación se ha creado correctamente.'];
      respuesta.data = newreparacion;
      return respuesta;
    } catch (err) {
      // since we have errors lets rollback the changes we made

      await queryRunner.rollbackTransaction();
      throw new NotFoundException(err);
    } finally {
      // you need to release a queryRunner which was manually instantiated
      await queryRunner.release();
    }
  }

  async updateReparacion(id: number, reparacionDto: ReparacionUpdateDto): Promise<MensajeModel> {
    const reparacion_found = await this.reparacionRepository.findOne(id);

    if (!reparacion_found) throw new NotFoundException('El tipo de reparacion no existe.');
    let reparacion_original = reparacion_found.reparacion;
    let imagen_original = reparacion_found.imagen;
    const { idModelo, precio, activo, reparacion, imagen } = reparacionDto;



    const repository_modelo_reparacion = getRepository<ModeloReparacion>(ModeloReparacion);

    await repository_modelo_reparacion.createQueryBuilder('modelo_reparacion')
      .update('modelo_reparacion')
      .set({
        activo: activo,
        precio: precio

      })
      .where('modelo_reparacion.idReparacion = :id', { id })
      .andWhere('modelo_reparacion.idModelo = :idModelo', { idModelo })
      .execute();

    if (reparacion_original !== reparacion || imagen_original !== imagen) {
      reparacion_found.reparacion = reparacion;
      reparacion_found.imagen = imagen;
      await this.reparacionRepository.save(reparacion_found);

      const reparaciones_iguales = await this.reparacionRepository.find({
        where: {
          reparacion: Equal(reparacion_original),
          idReparacion: Not(`${reparacion_found.idReparacion}`)
        },
        select: ['reparacion', 'idReparacion', 'imagen']
      })

      if (reparaciones_iguales.length > 0) {
        reparaciones_iguales.forEach(async (value) => {
          value.reparacion = reparacion;
          value.imagen = imagen;
          await this.reparacionRepository.save(value);
        })
      }
    }

    const respuesta = new MensajeModel();
    respuesta.mensaje = ['Se ha actualizado correctamente.'];
    respuesta.data = await this.reparacionRepository.save(reparacion_found);
    return respuesta;
  }

  async updatePrecioReparacion(id: number, reparacionDto: ReparacionUpdateDto): Promise<MensajeModel> {
    const { idModelo, precio } = reparacionDto;
    const repository_modelo_reparacion = getRepository<ModeloReparacion>(ModeloReparacion);

    const query = await repository_modelo_reparacion.createQueryBuilder('modelo_reparacion')
      .update('modelo_reparacion')
      .set({
        precio: precio
      })
      .where('modelo_reparacion.idReparacion = :id', { id })
      .andWhere('modelo_reparacion.idModelo = :idModelo', { idModelo })
      .execute();

    const respuesta = new MensajeModel();
    respuesta.mensaje = ['Se ha actualizado correctamente.'];
    return respuesta;
  }

  async updateEstadoReparacion(id: number, reparacionDto: ReparacionUpdateDto): Promise<MensajeModel> {

    const { idModelo, activo } = reparacionDto;
    const repository_modelo_reparacion = getRepository<ModeloReparacion>(ModeloReparacion);

    const query = await repository_modelo_reparacion.createQueryBuilder('modelo_reparacion')
      .update('modelo_reparacion')
      .set({
        activo: activo

      })
      .where('modelo_reparacion.idReparacion = :id', { id })
      .andWhere('modelo_reparacion.idModelo = :idModelo', { idModelo })
      .execute();


    const respuesta = new MensajeModel();
    respuesta.mensaje = ['Se ha actualizado correctamente'];
    return respuesta;
  }
}
