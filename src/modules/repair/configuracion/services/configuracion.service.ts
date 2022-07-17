import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MensajeModel } from 'src/models/mensaje.model';
import { Repository } from 'typeorm';
import { CreateConfiguracionDto } from '../dtos/create-configuracion.dto';
import { UpdateConfiguracionDto } from '../dtos/update-configuracion.dto';
import { Configuracion } from '../entity/configuracion.entity';

@Injectable()
export class ConfiguracionService {

    constructor(
      @InjectRepository(Configuracion)
      private readonly configuracionRepository: Repository<Configuracion>,
  ) { }

  async create(createConfiguracionDto: CreateConfiguracionDto): Promise<MensajeModel> {
    const configuracion =  this.configuracionRepository.create(createConfiguracionDto);
        
    const configuracion_respuesta = await this.configuracionRepository.save(configuracion);
    if (!configuracion_respuesta) {
        throw new NotFoundException(`La configuracion no se pudo guardar.`);
    }
    const respuesta = new MensajeModel();
    respuesta.mensaje = ['La configuracion se creó correctamente.'];
    respuesta.data = configuracion_respuesta;
    return respuesta;
  }

  async findAll(): Promise<Configuracion> {
    return await this.configuracionRepository.findOne();
  }

  async findOne(id: number): Promise<MensajeModel> {
    const found_configuracion = await this.configuracionRepository.findOne(id)
    if (!found_configuracion) {
        throw new NotFoundException(`Configuración con id "${id}" no encontrada.`)
    }

    const respuesta = new MensajeModel();
    respuesta.mensaje = ['Se ha encontrado una configuración.'];
    respuesta.data = found_configuracion;
    return respuesta;
  }

  async update(id: number, createConfiguracionDto: CreateConfiguracionDto): Promise<MensajeModel>{
    const configuracion = await this.configuracionRepository.findOne(id);

    if (!configuracion) throw new NotFoundException('No existe la configuración.');

    const configuracionEditar = Object.assign(configuracion, createConfiguracionDto);

    const respuesta = new MensajeModel();
    respuesta.mensaje = ['La configuración se ha actualizado correctamente.'];
    respuesta.data = await this.configuracionRepository.save(configuracionEditar);
    return respuesta;
  }

  async remove(id: number): Promise<MensajeModel> {
    const result = await this.configuracionRepository.delete(id);
    if (result.affected === 0) {
        throw new NotFoundException(`Configuracion con id "${id}" no encontrada.`);
    }

    const respuesta = new MensajeModel();
    respuesta.mensaje = ['Se ha eliminado correctamente.'];
    return respuesta;
  }
}
