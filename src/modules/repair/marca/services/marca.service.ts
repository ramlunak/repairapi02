import { ConflictException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryExceptionFilter } from 'src/filter/query-exception.filter';
import { MensajeModel } from 'src/models/mensaje.model';
import { Connection, Equal, getRepository, Not, QueryFailedError, Repository, Transaction, TransactionRepository } from 'typeorm';
import { Dispositivo } from '../../dispositivo/entity/dispositivo.entity';
import { DispositivoMarca } from '../../dispositivo/entity/dispositivomarca.entity';
import { ModeloReparacion } from '../../modelo/entity/modelo-reparacion';
import { ModeloEntity } from '../../modelo/entity/modelo.entity';
import { Taller } from '../../taller/entity/taller.entity';
import { MarcaCrearDto } from '../dtos/marca-crear-dto';
import { UpdateEstadoDto } from '../dtos/update-estado.dto';
import { UpdateMarcaDto } from '../dtos/update-marca.dto';
import { MarcaEntity } from '../entity/marca.entity';

@Injectable()
export class MarcaService {
    constructor(
        @InjectRepository(MarcaEntity)
        private readonly marcaRepository: Repository<MarcaEntity>,private connection: Connection
    ) { }

    async getMarcaAsignadas(idDispositivo: number, idTaller:number): Promise<MensajeModel> {
        const repository_dispositivo_marca = getRepository<DispositivoMarca>(DispositivoMarca);
        
        const query = repository_dispositivo_marca.createQueryBuilder('dispositivo_marca');
        query.where('dispositivo_marca.idDispositivo = :idDispositivo',{idDispositivo})
        const dispositivo_marca = await query.getMany();      

        const query_marca =  this.marcaRepository.createQueryBuilder('marca');
        const respuesta = new MensajeModel();
        if(dispositivo_marca.length > 0) {
           
            query_marca.whereInIds(dispositivo_marca);
            query_marca.andWhere('idTaller = :idTaller',{idTaller});
            const found_marca = await query_marca.getMany();
      
            respuesta.mensaje = ['Se han encontrado resultados.'];
            respuesta.data = found_marca;
            return respuesta;
           
        } else {
            respuesta.mensaje = ['No se han encontrado resultados.'];
            respuesta.data = [];
            return respuesta;
        }

        
      

    }

    async getAll(): Promise<MarcaEntity[]> {
        const found_marca = await this.marcaRepository.find();
        if (!found_marca) {
            throw new NotFoundException(`No existen marcas.`)
        }

       
        return found_marca;
    }

    async findOnMarca(id: number): Promise<MensajeModel> {
        const found_marca = await this.marcaRepository.findOne(id)
        if (!found_marca) {
            throw new NotFoundException(`Marca con id "${id}" no encontrada.`)
        }

        const respuesta = new MensajeModel();
        respuesta.mensaje = ['Se ha encontrado una coincidencia.'];
        respuesta.data = found_marca;
        return respuesta;
    }

    async findMarcaOnTaller(idTaller: number): Promise<MensajeModel> {
        const found_marca = await this.marcaRepository.find({
            where : {idTaller : idTaller}
        });
        if (!found_marca) {
            throw new NotFoundException(`No se encontraron resultados.`)
        }

        const respuesta = new MensajeModel();
        respuesta.mensaje = ['Se ha encontrado una coincidencia.'];
        respuesta.data = found_marca;
        return respuesta;
    }

    async findMarcaOnDispositivo(idDispositivo: number,idTaller: number): Promise<MensajeModel> {
        const repository_dispositivo_marca = getRepository<DispositivoMarca>(DispositivoMarca);
        
        const query = repository_dispositivo_marca.createQueryBuilder('dispositivo_marca');
        query.where('dispositivo_marca.idDispositivo = :idDispositivo',{idDispositivo})
        const dispositivo_marca = await query.getMany();
        
        const query_marca = this.marcaRepository.createQueryBuilder('marca');
        query_marca.innerJoinAndMapOne('marca.dispositivo_marca', DispositivoMarca,'dispositivo_marca','marca.idMarca = dispositivo_marca.idMarca and dispositivo_marca.idDispositivo =' + idDispositivo);
        if (dispositivo_marca.length > 0) {
            query_marca.whereInIds(dispositivo_marca);
            query_marca.andWhere('marca.idTaller = :idTaller',{idTaller});
            query_marca.orderBy('marca.marca','ASC');
            const found_marca = await query_marca.getMany();
       
            if (found_marca.length == 0) {            
                throw new NotFoundException(`No se encontraron marcas para este dispositivo.`)
            }
            const respuesta = new MensajeModel();
            respuesta.mensaje = ['Se han encontrado resultados.'];
            respuesta.data = found_marca;
            return respuesta;

        } else {
            const respuesta = new MensajeModel();
            respuesta.mensaje = ['No se encontraron marcas para este dispositivo.'];
            respuesta.data = [];           
            return respuesta; 
        }
    }

    async deleteMarca(idmarca: number, iddispositivo: number): Promise<MensajeModel> {
        const repository_dispositivo_marca = getRepository<DispositivoMarca>(DispositivoMarca);
        const query = repository_dispositivo_marca.createQueryBuilder('dispositivo_marca');
        query.where('dispositivo_marca.idMarca = :idmarca',{idmarca});
        query.andWhere('dispositivo_marca.idDispositivo = :iddispositivo',{iddispositivo});
        const dispositivo_marca = await query.getMany();
        await repository_dispositivo_marca.remove(dispositivo_marca);   

        const query_found = repository_dispositivo_marca.createQueryBuilder('dispositivo_marca');
        query_found.where('dispositivo_marca.idMarca = :idmarca',{idmarca});
        query_found.andWhere('dispositivo_marca.idDispositivo <> :iddispositivo',{iddispositivo});
        const dispositivo_marca_found = await query_found.getMany();

        if(dispositivo_marca_found.length <= 0){
            const result  = await this.marcaRepository.delete(idmarca);
            if (result.affected === 0) {
                throw new NotFoundException(`Marca con ID "${idmarca}" no encontrada`);
            }
        }

        const respuesta = new MensajeModel();
        respuesta.mensaje = ['Se ha eliminado correctamente.'];      
        return respuesta;
        
    }

    async saveMarca(crearMarca: MarcaCrearDto): Promise<MensajeModel> {


        const queryRunner = this.connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const {marca, idTaller, imagen, activo, idDispositivo} = crearMarca;
            const newmarca = new MarcaEntity();
            newmarca.marca = marca;
            newmarca.idTaller =  idTaller;
            newmarca.imagen = imagen;
            await queryRunner.manager.save(newmarca);
            if (!newmarca) {
                throw new NotFoundException(`Marca no insertada.`)
            }
            const dispositivo_marca = new DispositivoMarca();
            dispositivo_marca.idDispositivo = idDispositivo;
            dispositivo_marca.idMarca = newmarca.idMarca;
            dispositivo_marca.activo = activo;
            await queryRunner.manager.save(dispositivo_marca);
            
            
            const repository_dispositivo = getRepository<Dispositivo>(Dispositivo);
            

            const dispositivos = await repository_dispositivo.findOne(idDispositivo);

            const dispositivos_iguales = await repository_dispositivo.find({
                where: {                    
                    dispositivo: Equal(dispositivos.dispositivo),
                    idDispositivo : Not(`${idDispositivo}`)
                }
            });

            if (dispositivos_iguales.length > 0) {
              for (const dispo of dispositivos_iguales) {
                let marca_clonada = new MarcaEntity();
                marca_clonada.idTaller = dispo.idTaller;
                marca_clonada.imagen = imagen;
                marca_clonada.marca = marca;
                let new_marca = await queryRunner.manager.save(marca_clonada);

                let dispositivo_marca_clonada = new DispositivoMarca();
                dispositivo_marca_clonada.idDispositivo = dispo.idDispositivo;
                dispositivo_marca_clonada.idMarca = new_marca.idMarca;
                dispositivo_marca_clonada.activo = activo;
                await queryRunner.manager.save(dispositivo_marca_clonada);
              }
            }
            

            await queryRunner.commitTransaction();
            const respuesta = new MensajeModel();
            respuesta.mensaje = ['La marca se ha creado correctamente.'];
            respuesta.data = newmarca;
            return respuesta;
          } catch (err) {
            // since we have errors lets rollback the changes we made
            await queryRunner.rollbackTransaction();
           
            if(err instanceof QueryFailedError) {
                let mensaje = null;
                switch (err.driverError.errno) {
                    case 1451:
                      mensaje = 'Este registro esta siendo usado por otra tabla.';
                      break;
                      case 1062:
                        mensaje = 'La marca debe ser única. Usted puede asignar una marca existente al editar el dispositivo.';
                        break;    
                    default:
                      mensaje = 'Error desconocido.';
                      break;
                  }

                  throw new HttpException(mensaje,HttpStatus.CONFLICT);
            }
            
            
          } finally {
            // you need to release a queryRunner which was manually instantiated
            await queryRunner.release();
          }
    }

    async updateMarca(id: number, marcaDto: UpdateMarcaDto) : Promise<MensajeModel>{
       
        const marca_found  = await this.marcaRepository.findOne(id);
        if (!marca_found) throw new NotFoundException('La marca no existe.');
        const {marca,imagen} = marcaDto;
        let marca_original = marca_found.marca;

        marca_found.marca = marca;
        marca_found.imagen = imagen;
        const marca_new = await this.marcaRepository.save(marca_found);
     
        // Buscar marcas iguales distintas al taller base
        let marcas_iguales = await this.marcaRepository.find({
            where: {                    
                marca: Equal(marca_original),
                idMarca : Not(`${marca_found.idMarca}`)
            }
        });

        if(marcas_iguales.length > 0){
            marcas_iguales.forEach(async (value) => {
                value.marca = marca;
                value.imagen = imagen;
                await this.marcaRepository.save(value);
            })
        }

       

        const respuesta = new MensajeModel();
        respuesta.mensaje = ['Se ha actualizado correctamente.'];
        respuesta.data = marca_new;
        return respuesta;
    }

    async updateEstadoMarca(id: number, updateEstadoDto: UpdateEstadoDto) : Promise<MensajeModel>{
        
        const {activo, idMarca, idDispositivo} = updateEstadoDto;
        const repositorioModelo = getRepository<ModeloEntity>(ModeloEntity)
        const repository_dispositivo_marca = getRepository<DispositivoMarca>(DispositivoMarca);
        const repository_modelo_reparacion =  getRepository<ModeloReparacion>(ModeloReparacion);

        const marca  = await this.marcaRepository.findOne(id);

        if (!marca) throw new NotFoundException('La marca no existe');

        let queryMarcaDispositivos = repository_dispositivo_marca.createQueryBuilder('dispositivo_marca');
        queryMarcaDispositivos.andWhere('dispositivo_marca.idDispositivo = :idDispositivo ' ,{ idDispositivo })
        queryMarcaDispositivos.andWhere('dispositivo_marca.idMarca = :id ' ,{ id })
        const marcaDispositivos = await queryMarcaDispositivos.getMany();

        const dispositivo_marcas_update = marcaDispositivos.map((value) => {
            value.activo = activo            
            return value;
        });

        await repository_dispositivo_marca.save(dispositivo_marcas_update);

        //Obtener modelos
        const query_modelo = repositorioModelo.createQueryBuilder('modelo');
        query_modelo.where('modelo.idMarca IN (:idMarca)', { idMarca })
        query_modelo.andWhere('modelo.idDispositivo = :idDispositivo ', { idDispositivo })
        const modelos = await query_modelo.getMany();

        if (modelos.length <= 0) {
            const respuesta = new MensajeModel();
            respuesta.mensaje = ['Se ha actualizado el estado correctamente.'];
            respuesta.data = marca;            
            return respuesta;
        }
        // Actualizar modelos
        let idModelos = [];
        const modelo_update = modelos.map((value)=>{
            value.activo = activo;
            idModelos.push(value.idModelo);
            return value;
        })
        await repositorioModelo.save(modelo_update);

         //Obtener las reparaciones
         let queryModeloReparaciones = repository_modelo_reparacion.createQueryBuilder('modelo_reparacion');
         queryModeloReparaciones.where('modelo_reparacion.idModelo IN (' + idModelos + ')')
         let modeloReparaciones = await queryModeloReparaciones.getMany();
 
         if (modeloReparaciones.length <= 0) {
             const respuesta = new MensajeModel();
             respuesta.mensaje = ['Se ha actualizado el estado correctamente'];
             respuesta.data = marca;              
             return respuesta;
         }
 
         const modeloReparaciones_update = modeloReparaciones.map((value)=>{
             value.activo = activo
             return value;
         });
 
         await repository_modelo_reparacion.save(modeloReparaciones_update);

        const respuesta = new MensajeModel();
        respuesta.mensaje = ['Se ha actualizado correctamente.'];
        respuesta.data = marca;  
        return respuesta;
    }
}
