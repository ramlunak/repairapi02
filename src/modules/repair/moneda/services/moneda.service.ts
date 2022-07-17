import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Moneda } from '../entity/moneda.entity';
import { Repository } from 'typeorm';
import { MonedaCrearDto } from '../dtos/moneda.crear.dto';
import { MensajeModel } from 'src/models/mensaje.model';

@Injectable()
export class MonedaService {
    constructor(
        @InjectRepository(Moneda)
        private readonly  monedaRepository: Repository<Moneda>
    ) { }

    async getAll(): Promise<Moneda[]> {
        return await this.monedaRepository.find();
    }

    async findOnMoneda(id: number): Promise<MensajeModel> {
        const found_moneda = await this.monedaRepository.findOne(id)
        if (!found_moneda) {
            throw new NotFoundException(`Moneda con ID "${id}" no encontrada.`)
        }

        const respuesta = new MensajeModel();
        respuesta.mensaje = ['Se ha encontrado una coincidencia.'];
        respuesta.data = found_moneda;
        return respuesta;
    }

    async deleteMoneda(id: number): Promise<MensajeModel>{
       const result  = await this.monedaRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Moneda con ID "${id}" no se ha encontrada.`);
        }
        const respuesta = new MensajeModel();
        respuesta.mensaje = ['Se ha eliminado correctamente.'];
        return respuesta;
        
    }

    async saveMoneda(moneda: MonedaCrearDto): Promise<MensajeModel> {
        const moned = await this.monedaRepository.save(moneda);
        if(!moned){
            throw new NotFoundException(`Moneda no insertada.`)
          }
          const respuesta = new MensajeModel();
          respuesta.mensaje = ['Se ha eliminado correctamente.'];
          respuesta.data = moned;
          return respuesta;
    }

    async updateMoneda(id: number, moneda: MonedaCrearDto): Promise<MensajeModel>{
        const moned  = await this.monedaRepository.findOne(id);

        if (!moned) throw new NotFoundException('Esta moneda no existe.');

        const monedaEditar = Object.assign(moned,moneda);
        const respuesta = new MensajeModel();
        respuesta.mensaje = ['Se ha actualizado correctamente.'];
        respuesta.data = await monedaEditar.save();
        return respuesta;
    }
}
