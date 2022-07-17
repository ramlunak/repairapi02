import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MensajeModel } from 'src/models/mensaje.model';
import { Equal, getRepository, Not, Repository } from 'typeorm';
import { Dispositivo } from '../../dispositivo/entity/dispositivo.entity';
import { DispositivoMarca } from '../../dispositivo/entity/dispositivomarca.entity';
import { MarcaEntity } from '../../marca/entity/marca.entity';
import { ReparacionEntity } from '../../reparacion/entity/reparacion.entity';
import { Taller } from '../../taller/entity/taller.entity';
import { ModeloCrearDto } from '../dtos/modelo-crear-dto';
import { ModeloReparacion } from '../entity/modelo-reparacion';
import { ModeloEntity } from '../entity/modelo.entity';

@Injectable()
export class ModeloService {
    constructor(
        @InjectRepository(ModeloEntity)
        private readonly modeloRepository: Repository<ModeloEntity>,
    ) { }

    async getAll(): Promise<ModeloEntity[]> {
        return await this.modeloRepository.find();
    }

    async findOnModelo(id: number): Promise<MensajeModel> {
        const found_modelo = await this.modeloRepository.findOne(id)
        if (!found_modelo) {
            throw new NotFoundException(`Modelo con ID "${id}" no encontrado.`)
        }

        const respuesta = new MensajeModel();
        respuesta.mensaje = ['Se ha encontrado una coincidencia.'];
        respuesta.data = found_modelo;
        return respuesta;
    }

    async findOnMarcaDispositivo(idmarca: number, iddispositivo: number): Promise<MensajeModel> {
        const found_modelo = await this.modeloRepository.find({
            where: {
                idMarca: idmarca,
                idDispositivo: iddispositivo
            },
            order: {
                modelo: 'ASC'
            }
        });
        if (found_modelo.length <= 0) {
            throw new NotFoundException(`No se encontraron modelos para esta marca.`)
        }

        const respuesta = new MensajeModel();
        respuesta.mensaje = ['Se ha encontrado resultados.'];
        respuesta.data = found_modelo;
        return respuesta;
    }

    async deleteModelo(id: number): Promise<MensajeModel> {
        const repository_modelo_reparacion = getRepository<ModeloReparacion>(ModeloReparacion);

        const query = repository_modelo_reparacion.createQueryBuilder('modelo_reparacion');
        query.where('modelo_reparacion.idModelo = :idmodelo', { idmodelo: id });
        const modelo_reparacion = await query.getMany();
        if (modelo_reparacion.length > 0) {
            await repository_modelo_reparacion.remove(modelo_reparacion);
        }

        const result = await this.modeloRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Modelo con id "${id}" no encontrado.`);
        }

        const respuesta = new MensajeModel();
        respuesta.mensaje = ['Se ha eliminado correctamente.'];
        return respuesta;
    }

    async saveModelo(modeloDto: ModeloCrearDto): Promise<MensajeModel> {

        const reparacionRepository = getRepository<ReparacionEntity>(ReparacionEntity);

        const repository_marca = getRepository<MarcaEntity>(MarcaEntity);
        const repository_dispositivo_marca = getRepository<DispositivoMarca>(DispositivoMarca);
        const repository_dispositivo = getRepository<Dispositivo>(Dispositivo);

        const { idTaller, idDispositivo, idMarca, activo, imagen, modelo } = modeloDto;

        const reparaciones = await reparacionRepository.createQueryBuilder('reparacion')
            .andWhere('reparacion.idTaller = :idTaller', { idTaller: idTaller })
            .andWhere('reparacion.idDispositivo = :idDispositivo', { idDispositivo: idDispositivo })
            .distinct(true)
            .getMany();

        const modelo_new = this.modeloRepository.create(modeloDto);

        modelo_new.reparaciones = reparaciones;

        const modelo_respuesta = await modelo_new.save();
        if (!modelo_respuesta) {
            throw new NotFoundException(`El modelo no se insertó.`)
        }


        const marca = await repository_marca.findOne(idMarca);
        // Buscar marcas iguales distintas al taller base
        let marcas_iguales = await repository_marca.find({
            where: {
                marca: Equal(marca.marca),
                idMarca: Not(`${idMarca}`)
            }
        });

        let dispositivo = await repository_dispositivo.findOne(idDispositivo);

        if (marcas_iguales.length > 0) {
            for (const marca of marcas_iguales) {

                let lista_dispositivos = await repository_dispositivo.createQueryBuilder('dispositivo')
                    .andWhere('dispositivo.dispositivo LIKE :dispositivo', { dispositivo: `%${dispositivo.dispositivo}%` })
                    .andWhere('dispositivo.idTaller = :idtaller', { idtaller: marca.idTaller })
                    .andWhere('dispositivo.idDispositivo <> :idDispositivo', { idDispositivo })
                    .getMany();

                if (lista_dispositivos.length == 0) {
                    continue;
                } else {
                    let modelo_clonada = new ModeloEntity();
                    modelo_clonada.activo = activo;
                    modelo_clonada.idDispositivo = lista_dispositivos[0].idDispositivo;
                    modelo_clonada.idMarca = marca.idMarca;
                    modelo_clonada.modelo = modelo;
                    modelo_clonada.imagen = imagen;
                    modelo_clonada.reparaciones = reparaciones;
                    await modelo_clonada.save();
                }
            }
        }

        const respuesta = new MensajeModel();
        respuesta.mensaje = ['El modelo se ha creado correctamente.'];
        respuesta.data = modelo_respuesta;
        return respuesta;
    }


    async updateModelo(id: number, dtoModelo: ModeloCrearDto): Promise<MensajeModel> {

        const modelo_found = await this.modeloRepository.findOne(id);

        if (!modelo_found) throw new NotFoundException('Este modelo no existe.');
        const { modelo } = dtoModelo

        let modelo_original = modelo_found.modelo;
        modelo_found.modelo = modelo;
        const modelo_new = await this.modeloRepository.save(modelo_found);


        let modelos_iguales = await this.modeloRepository.find({
            where: {
                modelo: Equal(modelo_original),
                idModelo: Not(`${modelo_found.idModelo}`)
            }
        });

        if (modelos_iguales.length > 0) {

            modelos_iguales.forEach(async (value) => {
                value.modelo = modelo;
                await this.modeloRepository.save(value);
            })

        }

        const respuesta = new MensajeModel();
        respuesta.mensaje = ['Se ha actualizado correctamente.'];
        respuesta.data = modelo_new;
        return respuesta;
    }

    async updateEstado(id: number, dto: ModeloCrearDto): Promise<MensajeModel> {

        const repository_modelo_reparacion = getRepository<ModeloReparacion>(ModeloReparacion);
        const modelo = await this.modeloRepository.findOne(id);

        const { activo } = dto;

        if (!modelo) throw new NotFoundException('Este modelo no existe.');

        const modeloEditar = Object.assign(modelo, dto);

        const modelo_update = await this.modeloRepository.save(modeloEditar);

        let queryModeloReparaciones = await repository_modelo_reparacion.createQueryBuilder('modelo_reparacion')
            .update('modelo_reparacion')
            .set({
                activo: activo
            })
            .where('modelo_reparacion.idModelo = :idModelo', { idModelo: id })
            .execute();


        /* queryModeloReparaciones.where('modelo_reparacion.idModelo = :idModelo',{idModelo:id})
         let modeloReparaciones = await queryModeloReparaciones.getMany();*/

        const respuesta = new MensajeModel();
        respuesta.mensaje = ['Se ha actualizado correctamente.'];
        respuesta.data = modelo_update;
        return respuesta;
    }

}