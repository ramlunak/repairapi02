import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Imagen } from '../entity/imagen.entity';
import { Repository } from 'typeorm';
import { ImagenCrearDto } from '../dtos/imagen.crear.dto';
import { MensajeModel } from 'src/models/mensaje.model';

@Injectable()
export class ImagenService {
    constructor(
        @InjectRepository(Imagen)
        private readonly imagenRepository: Repository<Imagen>
    ) { }

    async getAll(): Promise<Imagen[]> {
        return await this.imagenRepository.find({ relations: ['diseno'] });
    }

    async findOnImagen(id: number): Promise<MensajeModel> {
        const found_imagen = await this.imagenRepository.findOne(id)
        if (!found_imagen) {
            throw new NotFoundException(`Imagen con ID "${id}" no encontrada.`)
        }

        const respuesta = new MensajeModel();
        respuesta.mensaje = ['Se ha encontrado una coincidencia.'];
        respuesta.data = found_imagen;
        return respuesta;
    }

    async deleteImagen(id: number): Promise<MensajeModel>  {
        const result = await this.imagenRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Imagen con ID "${id}" no encontrada`);
        }

        const respuesta = new MensajeModel();
        respuesta.mensaje = ['Se ha eliminado correctamente.'];        
        return respuesta;

    }

    async saveImagen(file: string, body): Promise<MensajeModel> {

        const image = new Imagen();
        image.idDiseno = body.idDiseno;
        image.imagen = file;
        await image.save();
        if (!image) {
            throw new NotFoundException(`Imagen no insertada.`)
        }
        const respuesta = new MensajeModel();
        respuesta.mensaje = ['Se ha creado correctamente.'];
        respuesta.data = image;
        return respuesta;
    }

    async updateImagen(id: number, imagen: ImagenCrearDto): Promise<MensajeModel> {
        const image = await this.imagenRepository.findOne(id);

        if (!image) throw new NotFoundException('Este diseño no existe.');

        const imagenEditar = Object.assign(image, imagen);
        const respuesta = new MensajeModel();
        respuesta.mensaje = ['Se ha actualizado correctamente.'];
        respuesta.data = await imagenEditar.save();
        return respuesta;
    }
}
