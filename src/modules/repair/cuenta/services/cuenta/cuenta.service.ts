
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cuenta } from '../../entity/cuenta.entity';
import { CuentaCrearDto } from '../../dtos/cuenta.crear.dto';
import { CuentaEditarDto } from '../../dtos/cuenta.editar.dto';

import { MensajeModel } from 'src/models/mensaje.model';
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';


@Injectable()
export class CuentaService {

    constructor(
        @InjectRepository(Cuenta)
        private readonly cuentaRepository: Repository<Cuenta>,
    ) { }

    async getAll(): Promise<Cuenta[]> {
        return await this.cuentaRepository.find();
    }

    async findOnCuenta(id: number): Promise<MensajeModel> {
        const found_cuenta = await this.cuentaRepository.findOne(id)
        if (!found_cuenta) {
            throw new NotFoundException(`Cuenta con ID "${id}" no encontrada.`)
        }

        const respuesta = new MensajeModel();
        respuesta.mensaje = ['Se ha encontrado una coincidencia.'];
        respuesta.data = found_cuenta;
        return respuesta;
    }

    async paginate(options: IPaginationOptions, search: string, field: string, order: number): Promise<Pagination<Cuenta>> {
        const orderby = order == 1 ? 'ASC' : 'DESC';

        const queryBuilder = this.cuentaRepository.createQueryBuilder('cuenta');
        queryBuilder.orWhere('cuenta.nombre LIKE :search', { search: `%${search}%` })
        queryBuilder.orWhere('cuenta.apellidoPaterno LIKE :search', { search: `%${search}%` })
        queryBuilder.orWhere('cuenta.apellidoMaterno LIKE :search', { search: `%${search}%` })
        queryBuilder.orWhere('cuenta.email LIKE :search', { search: `%${search}%` })
        queryBuilder.orWhere('cuenta.dni LIKE :search', { search: `%${search}%` })
        queryBuilder.orWhere('cuenta.telefono LIKE :search', { search: `%${search}%` })
        queryBuilder.orWhere('cuenta.direccion LIKE :search', { search: `%${search}%` })
        queryBuilder.orderBy(field, orderby); // Or whatever you need to do

        return paginate<Cuenta>(queryBuilder, options);
    }

    async deleteCuenta(id: number): Promise<MensajeModel> {
        const result = await this.cuentaRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`La cuenta con ID "${id}" no se ha encontrado.`);
        }

        const respuesta = new MensajeModel();
        respuesta.mensaje = ['Se ha eliminado correctamente.'];
        return respuesta;
    }

    async saveCuenta(cuentaDto: CuentaCrearDto): Promise<MensajeModel>{
        const cuenta = await this.cuentaRepository.create(cuentaDto);
        
        const cuenta_respuesta = await this.cuentaRepository.save(cuenta);
        if (!cuenta_respuesta) {
            throw new NotFoundException(`La cuenta no se ha podido crear.`)
        }
        const respuesta = new MensajeModel();
        respuesta.mensaje = ['La cuenta se ha creado correctamente.'];
        respuesta.data = cuenta_respuesta;
        return respuesta;
    }

    async updateCuenta(id: number, dto: CuentaEditarDto): Promise<MensajeModel>{
        const cuenta = await this.cuentaRepository.findOne(id);

        if (!cuenta) throw new NotFoundException('Esta cuenta no existe.');

        const cuentaEditar = Object.assign(cuenta, dto);

        const respuesta = new MensajeModel();
        respuesta.mensaje = ['Se ha actualizado correctamente.'];
        respuesta.data = await this.cuentaRepository.save(cuentaEditar);
        return respuesta;
    }

}
