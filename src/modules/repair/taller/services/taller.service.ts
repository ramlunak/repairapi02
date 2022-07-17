import { ConsoleLogger, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';
import { DEFAULT_IVA } from 'src/constants';
import { MensajeModel } from 'src/models/mensaje.model';
import { Brackets, getRepository, Repository } from 'typeorm';
import { DispositivoCrearDto } from '../../dispositivo/dtos/dispositivo-crear.dto';
import { DispositivoMarcaCrearDto } from '../../dispositivo/dtos/dispositivo.marca.dto';
import { Dispositivo } from '../../dispositivo/entity/dispositivo.entity';
import { DispositivoMarca } from '../../dispositivo/entity/dispositivomarca.entity';
import { MarcaCrearDto } from '../../marca/dtos/marca-crear-dto';
import { MarcaEntity } from '../../marca/entity/marca.entity';
import { ModeloCrearDto } from '../../modelo/dtos/modelo-crear-dto';
import { ModeloReparacion } from '../../modelo/entity/modelo-reparacion';
import { ModeloEntity } from '../../modelo/entity/modelo.entity';
import { ReparacionCrearDto } from '../../reparacion/dtos/reparacion-crear.dto';
import { ReparacionEntity } from '../../reparacion/entity/reparacion.entity';
import { TallerCrearDto } from '../dtos/taller-crear.dto';
import { Taller } from '../entity/taller.entity';

@Injectable()
export class TallerService {
    constructor(
        @InjectRepository(Taller)
        private readonly tallerRepository: Repository<Taller>
    ) { }

    async getAll(idCuenta?: number, idRol?: number, search?: string): Promise<Taller[]> {

        const query = this.tallerRepository.createQueryBuilder('taller');

        if (idCuenta > 0) {
            query.where('taller.idCuenta = :idCuenta', { idCuenta })
        }       
        if (idRol) {
            query.where('taller.idRol = :idRol', { idRol })
        }

        if (search) {
            query.andWhere('taller.nombre LIKE :search', { search: `%${search}%` })
            query.orWhere('taller.direccion LIKE :search', { search: `%${search}%` })
        }

        const taller = await query.getMany();
        return taller;
       
    }

    async paginate(options: IPaginationOptions, search: string, field: string, order: number,idCuenta: number,idRol: number): Promise<Pagination<Taller>> {
        const orderby = order == 1 ? 'ASC' : 'DESC';
        let idcuenta: number = Number(idCuenta);
        
        const queryBuilder = this.tallerRepository.createQueryBuilder('taller');
       
        queryBuilder.andWhere(new Brackets(qb=>{
            qb.where('taller.nombre LIKE :search', { search: `%${search}%` })
            .orWhere('taller.direccion LIKE :search', { search: `%${search}%` })
            .orWhere('taller.email LIKE :search', { search: `%${search}%` })
            .orWhere('taller.detalles LIKE :search', { search: `%${search}%` });
        }))    
        if (idcuenta > 0) {
            queryBuilder.where('taller.idCuenta = :idcuenta', {idcuenta})
        }

         if (idRol) {
            queryBuilder.andWhere('taller.idRol = :idRol', { idRol })
        }
        
        queryBuilder.orderBy('taller.' + field, orderby);
         // Or whatever you need to do
          
        return paginate<Taller>(queryBuilder, options);
    }

    async findOnTaller(id: number): Promise<MensajeModel> {
        const taller = await this.tallerRepository.findOne(id)
        if (!taller) {
            throw new NotFoundException(`El taller con ID "${id}" no se ha encontrado.`)
        }

        const respuesta = new MensajeModel();
        respuesta.mensaje = ['Se ha encontrado una coincidencia.'];
        respuesta.data = taller;
        return respuesta;
    }

    async deleteTaller(id: number): Promise<MensajeModel> {
        const result = await this.tallerRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`El taller con ID "${id}" no se ha encontrado.`);
        }

        const respuesta = new MensajeModel();
        respuesta.mensaje = ['Se ha eliminado correctamente.'];
        return respuesta;
    }

    async saveTaller(tallerDto: TallerCrearDto): Promise<MensajeModel> {
        
        try {
            
            const taller = await this.tallerRepository.save(tallerDto);
        
        if (!taller) {
            throw new NotFoundException(`El taller no se ha podido insertar.`)
        }
        const respuesta = new MensajeModel();
        respuesta.mensaje = ['El taller se ha creado correctamente.'];
        respuesta.data = taller;
        return respuesta;
        } catch (error) {
            console.log(error);
        }
    }

    async updateTaller(id: number, tallerDto: TallerCrearDto): Promise<MensajeModel> {
       

        try {
            const taller = await this.tallerRepository.findOne(id);

            if (!taller) throw new NotFoundException('Este taller no existe.');
            
            const tallerEditar = Object.assign(taller, tallerDto);            
            const respuesta = new MensajeModel();
            respuesta.mensaje = ['Se ha actualizado correctamente.'];
            respuesta.data = await tallerEditar.save();
            return respuesta;
        } catch (error) {
            console.log(error);
        }
    }

    


    async clonarTaller(idTaller: number,idBase: number): Promise<MensajeModel> {     

        if(idTaller === idBase) {
            const respuesta = new MensajeModel();
            respuesta.mensaje = ['Este taller está configurado como base.'];
            return respuesta;
            
        }

        try {
            
            //Taller base
            let idTallerBase = idBase;
            let marcas = [];
            let dispositivos = [];
            let modelos = [];
            let reparaciones = [];
            let modeloReparaciones = [];
            var idsMarcas = [];
            var idsModelos = [];
            var idsDispositivos = [];
            var idsReparaciones = [];
            var marcaDispositivos = [];


            const marcaRepository = getRepository<MarcaEntity>(MarcaEntity);
            const dispositivoRepository = getRepository<Dispositivo>(Dispositivo);
            const repository_dispositivo_marca = getRepository<DispositivoMarca>(DispositivoMarca);
            const modeloRepository = getRepository<ModeloEntity>(ModeloEntity);
            const repository_modelo_reparacion =  getRepository<ModeloReparacion>(ModeloReparacion);
            const reparacionRepository =  getRepository<ReparacionEntity>(ReparacionEntity);
            //Verificar que no este configurado el taller
            const founf_dispositivos = await dispositivoRepository.createQueryBuilder('dispositivo')            
            .andWhere('dispositivo.idTaller =:idTaller', { idTaller })
            .getMany();
            if (founf_dispositivos.length > 0) {
                const respuesta = new MensajeModel();
                respuesta.mensaje = ['Este taller ya se encuentra configurado.'];
                return respuesta;
            }

            //Buscar las marcas del taller base
            let queryMarcas = marcaRepository.createQueryBuilder('marca');
            queryMarcas.where('marca.idTaller = :idTallerBase', { idTallerBase })
            marcas = await queryMarcas.getMany();

            let filtro_marcas = marcas.map(value =>{
                return value.idMarca;
            })

            //Buscar los dispositivos del taller base
            let queryDispositivos = dispositivoRepository.createQueryBuilder('dispositivo');            
            queryDispositivos.andWhere('dispositivo.idTaller =:idTallerBase', { idTallerBase })
            dispositivos = await queryDispositivos.getMany();

            let filtro_dispositivos = dispositivos.map(value =>{
                return value.idDispositivo;
            })

            //Buscar las relaciones de marca y dispotivivo del taller base
            let queryMarcaDispositivos = repository_dispositivo_marca.createQueryBuilder('dispositivo_marca');
            queryMarcaDispositivos.andWhere('dispositivo_marca.idDispositivo IN (' + filtro_dispositivos + ')')
            marcaDispositivos = await queryMarcaDispositivos.getMany();

            //Buscar los modelo del taller base 
            let queryModelos = modeloRepository.createQueryBuilder('modelo');
            queryModelos.andWhere('modelo.idMarca IN (' + filtro_marcas + ')')
            modelos = await queryModelos.getMany();

            let filtro_modelos = modelos.map(value=>{
                return value.idModelo;
            })

            //Buscar las reparaciones del taller base
            let queryReparaciones = reparacionRepository.createQueryBuilder('reparacion');
            queryReparaciones.where('reparacion.idTaller =:idTallerBase', { idTallerBase })
            reparaciones = await queryReparaciones.getMany();

            //  //Buscar las relaciones de modelo y reparaciones del taller base
            //  let queryModeloReparaciones = repository_modelo_reparacion.createQueryBuilder('modelo_reparacion');
            //  queryModeloReparaciones.where('modelo_reparacion.idModelo IN (' + filtro_modelos + ')')
            //  modeloReparaciones = await queryModeloReparaciones.getMany();
 

            //Insertar las marcas y dispositivos en el taller nuevo y guardar en un array la relacion de ids viejos con los nuevos
            async function saveMarca(marca) {
                return new Promise(async (resolved, rejected) => {
                    let container = new MarcaEntity();
                    container.idTaller = idTaller;
                    container.marca = marca.marca;
                    container.imagen = marca.imagen;                    
                    let new_marca = await marcaRepository.save(container);
                    resolved(new_marca);
                });
            }

            async function saveMarcas(marcas) {
                for (const marca of marcas) {
                    const res: any = await saveMarca(marca);
                    idsMarcas[marca.idMarca] = res.idMarca;
                }
            }

            async function saveDispositivo(dispositivo: Dispositivo) {
                return new Promise(async (resolved, rejected) => {
                    let container = new Dispositivo();
                    container.idTaller = idTaller;
                    container.dispositivo = dispositivo.dispositivo;
                    container.imagen = dispositivo.imagen;
                    container.activo = dispositivo.activo;
                    let new_dispositivo = await dispositivoRepository.save(container);
                    resolved(new_dispositivo);
                });
            }

            async function saveDispositivos(dispositivos) {
                for (const dispositivo of dispositivos) {
                    const res: any = await saveDispositivo(dispositivo);
                    idsDispositivos[dispositivo.idDispositivo] = res.idDispositivo;
                }
            }

            async function saveMarcaDispositivo(relacion: DispositivoMarca) {
                return new Promise(async (resolved, rejected) => {
                    let container = new DispositivoMarca();
                    //container.idTaller = idTaller;
                    container.idDispositivo = relacion.idDispositivo;
                    container.idMarca = relacion.idMarca;
                    container.activo = relacion.activo;
                    let new_relacion = await repository_dispositivo_marca.save(container);
                    resolved(new_relacion);
                });
            }

            async function saveMarcaDispositivos(relaciones:DispositivoMarca[]) {

                //Reemplazar ids
                for (const relacion of relaciones) {                
                    //reemplazar ids
                    relacion.idMarca = idsMarcas[relacion.idMarca];
                    relacion.idDispositivo = idsDispositivos[relacion.idDispositivo];
                    const res: any = await saveMarcaDispositivo(relacion);                 
                }
            }

            async function saveModelo(modelo) {
                return new Promise(async (resolved, rejected) => {
                    let container = new ModeloEntity();
                    container.idMarca = idsMarcas[modelo.idMarca];
                    container.idDispositivo = idsDispositivos[modelo.idDispositivo];
                    container.modelo = modelo.modelo;
                    container.imagen = modelo.imagen;
                    container.activo = modelo.activo;
                    let new_modelo = await modeloRepository.save(container);
                    resolved(new_modelo);
                });
            }

            async function saveModelos(modelos) {
                for (const modelo of modelos) {
                    const res: any = await saveModelo(modelo);
                    idsModelos[modelo.idModelo] = res.idModelo;
                }
            }

            async function saveReparacion(repara) {
                return new Promise(async (resolved, rejected) => {
                    let container = new ReparacionEntity();
                    container.idTaller = idTaller;
                    container.reparacion = repara.reparacion;
                    container.imagen = repara.imagen;                   
                    container.idDispositivo = idsDispositivos[repara.idDispositivo];
                    let new_reparacion = await reparacionRepository.save(container);
                    resolved(new_reparacion);
                });
            }

            async function saveReparaciones(reparaciones) {
                for (let reparacion of reparaciones) {                    
                    const res: any = await saveReparacion(reparacion);
                    idsReparaciones[reparacion.idReparacion] = res.idReparacion;
                }
            }

            // async function saveModeloReparacion(relacion: ModeloReparacion) {
            //     return new Promise(async (resolved, rejected) => {
            //         let container = new ModeloReparacion();
            //         //container.idTaller = idTaller;
            //         container.idModelo = relacion.idModelo;
            //         container.idReparacion = relacion.idReparacion;
            //         container.precio = relacion.precio;
            //         container.activo = relacion.activo;
            //         let new_relacion = await repository_modelo_reparacion.save(container);
            //         resolved(new_relacion);
            //     });
            // }

            // async function saveModeloReparaciones(relaciones:ModeloReparacion[]) {
            //     //Reemplazar ids
            //     for (const relacion of relaciones) {                
            //         //reemplazar ids
            //         relacion.idModelo = idsModelos[relacion.idModelo];
            //         relacion.idReparacion = idsReparaciones[relacion.idReparacion];
            //         const res: any = await saveModeloReparacion(relacion);                 
            //     }
            // }


            await (async () => {
                await saveMarcas(marcas)
                await saveDispositivos(dispositivos)
                await saveMarcaDispositivos(marcaDispositivos)
                await saveModelos(modelos);
                await saveReparaciones(reparaciones);
                //await saveModeloReparaciones(modeloReparaciones);
               
            })()
                const respuesta = new MensajeModel();
                respuesta.mensaje = ['Se ha clonado correctamente el taller.'];
                return respuesta;
           

        } catch {
            const respuesta = new MensajeModel();
            respuesta.mensaje = ['error'];
            return respuesta;
        }      
     

    }
    
}
