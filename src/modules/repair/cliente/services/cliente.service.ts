
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, QueryRunnerProviderAlreadyReleasedError, Repository } from 'typeorm';
import { Cliente } from '../entity/cliente.entity';
import { ClienteCrearDto } from '../dtos/cliente.crear.dto';
import { ClienteEditarDto } from '../dtos/cliente.editar.dto';

import { MensajeModel } from 'src/models/mensaje.model';
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';


@Injectable()
export class ClienteService {

    constructor(
        @InjectRepository(Cliente)
        private readonly clienteRepository: Repository<Cliente>,
    ) { }

    async getAll(): Promise<Cliente[]> {
        return await this.clienteRepository.find();
    }

    async findOnCliente(id: number): Promise<MensajeModel> {
        const found_cliente = await this.clienteRepository.findOne(id)
        if (!found_cliente) {
            throw new NotFoundException(`Cliente con ID "${id}" no encontrado.`)
        }

        const respuesta = new MensajeModel();
        respuesta.mensaje = ['Se ha encontrado una coincidencia.'];
        respuesta.data = found_cliente;
        return respuesta;
    }

    async paginate(options: IPaginationOptions, search: string, field: string, order: number,idTaller: number): Promise<Pagination<Cliente>> {
        const orderby = order == 1 ? 'ASC' : 'DESC';
        let idtaller: number = Number(idTaller);
        const queryBuilder =
          this.clienteRepository.createQueryBuilder('cliente');
          
        queryBuilder.where('cliente.idTaller = :idtaller', { idtaller })
        queryBuilder.andWhere(new Brackets(qb => {
            qb.where('cliente.nombre LIKE :search', {search: `%${search}%`})
            .orWhere('cliente.apellidoPaterno LIKE :search', {search: `%${search}%`})
            .orWhere('cliente.apellidoMaterno LIKE :search', {search: `%${search}%`})
            .orWhere('cliente.email LIKE :search', {search: `%${search}%`})
            .orWhere('cliente.dni LIKE :search', {search: `%${search}%`})
            .orWhere('cliente.telefono LIKE :search', {search: `%${search}%`})
            .orWhere('cliente.direccion LIKE :search', {search: `%${search}%`});
            
        }))       
        queryBuilder.orderBy(field, orderby);
        // Or whatever you need to do
        //console.log(queryBuilder.getSql());
        return paginate<Cliente>(queryBuilder, options);
    }

    async getClientePorTelefono(search: string,idTaller: number): Promise<Cliente> {
        let idtaller: number = Number(idTaller);
        const queryBuilder = this.clienteRepository.createQueryBuilder('cliente');
        queryBuilder.where('cliente.telefono LIKE :search', { search: `${search}` })
        queryBuilder.andWhere('cliente.idTaller = :idtaller',{ idtaller })

        return await queryBuilder.getOne();
    }

    async deleteCliente(id: number): Promise<MensajeModel> {
        const result = await this.clienteRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`El cliente con ID "${id}" no se ha encontrado.`);
        }

        const respuesta = new MensajeModel();
        respuesta.mensaje = ['Se ha eliminado correctamente.'];
        return respuesta;
    }

    async saveCliente(clienteDto: ClienteCrearDto): Promise<MensajeModel>{
        const cliente = await this.clienteRepository.create(clienteDto);
        
        const cliente_respuesta = await this.clienteRepository.save(cliente);
        if (!cliente_respuesta) {
            throw new NotFoundException(`El cliente no se pudo crear.`)
        }
        const respuesta = new MensajeModel();
        respuesta.mensaje = ['El cliente se ha creado correctamente.'];
        respuesta.data = cliente_respuesta;
        return respuesta;
    }

    async updateCliente(id: number, dto: ClienteEditarDto): Promise<MensajeModel>{
        const cliente = await this.clienteRepository.findOne(id);

        if (!cliente) throw new NotFoundException('Este cliente no existe.');

        const clienteEditar = Object.assign(cliente, dto);

        const respuesta = new MensajeModel();
        respuesta.mensaje = ['Se ha actualizado correctamente.'];
        respuesta.data = await this.clienteRepository.save(clienteEditar);
        return respuesta;
    }

}
