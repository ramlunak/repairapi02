import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Diseno } from '../../entity/diseno.entity';
import { Repository } from 'typeorm';
import { DisenoCrearDto } from '../../dtos/diseno.crear.dto';
import { MensajeModel } from 'src/models/mensaje.model';

@Injectable()
export class DisenoService {

    constructor(
        @InjectRepository(Diseno)
        private readonly disenoRepository: Repository<Diseno>
    ) { }

    async getAll(): Promise<Diseno[]> {
        return await this.disenoRepository.find();
    }

    async findOnDiseno(id: number): Promise<MensajeModel> {
        const found_diseno = await this.disenoRepository.findOne(id)
        if (!found_diseno) {
            throw new NotFoundException(`Diseño con ID "${id}" no encontrado.`)
        }

        const respuesta = new MensajeModel();
        respuesta.mensaje = ['Se ha encontrado una coincidencia.'];
        respuesta.data = found_diseno;
        return respuesta;
    }

    async deleteDiseno(id: number): Promise<MensajeModel> {
        const result = await this.disenoRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Diseño con ID "${id}" no encontrado.`);
        }
        const respuesta = new MensajeModel();
        respuesta.mensaje = ['Se ha eliminado correctamente.'];
        return respuesta;

    }

    async saveDiseno(diseno: DisenoCrearDto): Promise<MensajeModel> {
        const dise = await this.disenoRepository.save(diseno);
        if (!dise) {
            throw new NotFoundException(`Diseño no insertado.`)
        }
        const respuesta = new MensajeModel();
        respuesta.mensaje = ['El diseño se ha creado correctamente.'];
        respuesta.data = dise;
        return respuesta;
    }

    async updateDiseno(id: number, diseno: DisenoCrearDto): Promise<MensajeModel> {
        const dise = await this.disenoRepository.findOne(id);

        if (!dise) throw new NotFoundException('Este diseño no existe.');

        const disenoEditar = Object.assign(dise, diseno);
        const respuesta = new MensajeModel();
        respuesta.mensaje = ['Se ha actualizado correctamente.'];
        respuesta.data = await disenoEditar.save();
        return respuesta;
    }
}
