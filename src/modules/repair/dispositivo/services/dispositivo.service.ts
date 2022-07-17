import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { image } from 'pdfkit';
import { MensajeModel } from 'src/models/mensaje.model';
import { Any, Equal, getRepository, In, Not, Repository } from 'typeorm';
import { MarcaEntity } from '../../marca/entity/marca.entity';
import { ModeloReparacion } from '../../modelo/entity/modelo-reparacion';
import { ModeloEntity } from '../../modelo/entity/modelo.entity';
import { Taller } from '../../taller/entity/taller.entity';
import { DispositivoCrearDto } from '../dtos/dispositivo-crear.dto';
import { AsignarMarcaDispositivoDto } from '../entity/asignar-marca-dispositivo.dto';
import { Dispositivo } from '../entity/dispositivo.entity';
import { DispositivoMarca } from '../entity/dispositivomarca.entity';

@Injectable()
export class DispositivoService {
    constructor(
        @InjectRepository(Dispositivo)
        private readonly  dispositivoRepository: Repository<Dispositivo>
    ) { }

    async getAll(idTaller?: number): Promise<Dispositivo[]> {
        const query = await this.dispositivoRepository.createQueryBuilder('dispositivo');
        if (idTaller) {
            query.where('dispositivo.idTaller = :idTaller', { idTaller })
        }
        query.orderBy('dispositivo.dispositivo','ASC')

      
        const dispositivo = await query.getMany();
        return dispositivo;
        //return await this.dispositivoRepository.find();
    }

    async getActivo(idTaller?: number): Promise<Dispositivo[]> {
        const query = await this.dispositivoRepository.createQueryBuilder('dispositivo');
        if (idTaller) {
            query.where('dispositivo.idTaller = :idTaller', { idTaller })
            query.andWhere('dispositivo.activo = 1')
        }
        query.orderBy('dispositivo.dispositivo','ASC')
      
        const dispositivo = await query.getMany();
        return dispositivo;
        //return await this.dispositivoRepository.find();
    }

    async findOnDispositivo(id: number): Promise<MensajeModel> {
        const found_dispositivo = await this.dispositivoRepository.findOne(id)
        if (!found_dispositivo) {
            throw new NotFoundException(`Dispositivo con ID "${id}" no encontrado.`)
        }
        const respuesta = new MensajeModel();
        respuesta.mensaje = ['Se ha encontrado una coincidencia.'];
        respuesta.data = found_dispositivo;
        return respuesta;
    }

    async deleteDispositivo(id: number): Promise<MensajeModel>{
        const repository_dispositivo_marca = getRepository<DispositivoMarca>(DispositivoMarca);
        const repository_modelo_reparacion = getRepository<ModeloReparacion>(ModeloReparacion);
        const repository_modelo = getRepository<ModeloEntity>(ModeloEntity);
        const query = repository_dispositivo_marca.createQueryBuilder('dispositivo_marca');
        query.where('dispositivo_marca.idDispositivo = :id',{id})
        const dispositivo_marca = await query.getMany();
        await repository_dispositivo_marca.remove(dispositivo_marca);   
       const result  = await this.dispositivoRepository.delete(id);

       //Eliminar modelo del dispositivo
       const query_modelo = repository_modelo.createQueryBuilder('modelo');
       query_modelo.where('modelo.idDispositivo = :id',{id})
       const modelos = await query_modelo.getMany();

       let idsModelos = modelos.map(value=>{
           return value.idModelo;
       })

       //Buscar en la tabla relacion modelo-reparación
       const query_modelo_reparacion = repository_modelo_reparacion.createQueryBuilder('modelo_reparacion');
       query_modelo_reparacion.where(`modelo_reparacion.idModelo IN ("${idsModelos}")`)
       const modelo_reparacion = await query_modelo_reparacion.getMany();
       await repository_modelo_reparacion.remove(modelo_reparacion);
       await repository_modelo.remove(modelos);

        if (result.affected === 0) {
            throw new NotFoundException(`El dispositivo con ID "${id}" no se ha podido encontrar.`);
        }
        const respuesta = new MensajeModel();
        respuesta.mensaje = ['Se ha eliminado correctamente.'];
        return respuesta;        
    }

    async saveDispositivo(createDispositivo: DispositivoCrearDto): Promise<MensajeModel> {
        
        try {
            const { idTaller,imagen,dispositivo,activo } = createDispositivo;
            const dispositivo_new = await this.dispositivoRepository.save(createDispositivo);
            if (!dispositivo_new) {
                throw new NotFoundException(`Dispositivo no insertado.`)
            }
            const repository_talleres = getRepository<Taller>(Taller);

            const talleres = await repository_talleres.find({
                where: {
                    idTaller: Not(`${idTaller}`)
                }
            });

           
            if (talleres.length > 0) {

            const dispositivos_clonados = talleres.map(value=>{
                let idTaller = value.idTaller;
                const disposi: DispositivoCrearDto = { idTaller,imagen ,activo,dispositivo}
                return disposi;
            })
            const clonado = await this.dispositivoRepository.save(dispositivos_clonados);
            if (clonado.length <=0) {
                throw new NotFoundException(`El Dispositivo no se clonó correctamente a los demás talleres.`)
            }                
            }   
            
            const respuesta = new MensajeModel();
            respuesta.mensaje = ['El Dispositivo se ha creado correctamente.'];
            respuesta.data = dispositivo_new;
            return respuesta;
        } catch (error) {
            throw new HttpException(`Dispositivo no insertado.`,HttpStatus.NOT_FOUND);
        }
        
       
    }

    async updateDispositivo(id: number, dispositivoDto: DispositivoCrearDto) : Promise<MensajeModel>{
        
        const dispositivo_found  = await this.dispositivoRepository.findOne(id);
        if (!dispositivo_found) throw new NotFoundException('El dispositivo no existe.');
        const {activo,dispositivo,idTaller,imagen} = dispositivoDto;
        let dispositivo_original = dispositivo_found.dispositivo;

        dispositivo_found.activo = activo;
        dispositivo_found.dispositivo = dispositivo;
        dispositivo_found.idTaller = idTaller;
        dispositivo_found.imagen = imagen;
        const dispositivo_new = await this.dispositivoRepository.save(dispositivo_found);
        

        const dispositivos_iguales = await this.dispositivoRepository.find({
            where: {                    
                dispositivo: Equal(dispositivo_original),
                idDispositivo : Not(`${id}`)
            }
        });

        if (dispositivos_iguales.length > 0) {
            dispositivos_iguales.forEach(async (value) => {
                value.activo = activo;
                value.dispositivo = dispositivo;
                value.imagen = imagen;
                await this.dispositivoRepository.save(value);
            })    
        }

     
        const respuesta = new MensajeModel();
        respuesta.mensaje = ['Se ha actualizado correctamente.'];
        respuesta.data = dispositivo_new;
        return respuesta;
    }

    async updateEstadoDispositivo(id: number, dispositivoDto: DispositivoCrearDto) : Promise<MensajeModel>{
        
        const {idTaller,activo} = dispositivoDto;
        const repositorioMarca = getRepository<MarcaEntity>(MarcaEntity)
        const repositorioModelo = getRepository<ModeloEntity>(ModeloEntity)
        const repository_dispositivo_marca = getRepository<DispositivoMarca>(DispositivoMarca);
        const repository_modelo_reparacion =  getRepository<ModeloReparacion>(ModeloReparacion);

        const dispositivo  = await this.dispositivoRepository.findOne(id);

        if (!dispositivo) throw new NotFoundException('El dispositivo no existe.');
        const dispositivoEditar = Object.assign(dispositivo,dispositivoDto);
        const nuevo_dispositivo = await dispositivoEditar.save();

        let queryMarcaDispositivos = repository_dispositivo_marca.createQueryBuilder('dispositivo_marca');
        queryMarcaDispositivos.andWhere('dispositivo_marca.idDispositivo = :id ' ,{ id })
        const marcaDispositivos = await queryMarcaDispositivos.getMany();
        let idMarca = [];
        if (marcaDispositivos.length <= 0) {
            const respuesta = new MensajeModel();
            respuesta.mensaje = ['Se ha actualizado el estado correctamente.'];
            respuesta.data = nuevo_dispositivo;
            return respuesta;
        }
        const dispositivo_marcas_update = marcaDispositivos.map((value) => {
            value.activo = activo
            idMarca.push(value.idMarca);
            return value;
        });

        await repository_dispositivo_marca.save(dispositivo_marcas_update);
        
       //Obtener modelos
        const query_modelo = repositorioModelo.createQueryBuilder('modelo');
        query_modelo.where('modelo.idMarca IN (:idMarca)', { idMarca })
        query_modelo.andWhere('modelo.idDispositivo = :id ', { id })
        const modelos = await query_modelo.getMany();

        if (modelos.length <= 0) {
            const respuesta = new MensajeModel();
            respuesta.mensaje = ['Se ha actualizado el estado correctamente.'];
            respuesta.data = nuevo_dispositivo;
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
            respuesta.mensaje = ['Se ha actualizado el estado correctamente.'];
            respuesta.data = nuevo_dispositivo;
            return respuesta;
        }

        const modeloReparaciones_update = modeloReparaciones.map((value)=>{
            value.activo = activo
            return value;
        });

        await repository_modelo_reparacion.save(modeloReparaciones_update);
       
        const respuesta = new MensajeModel();
        respuesta.mensaje = ['Se ha actualizado el estado correctamente.'];
        respuesta.data = nuevo_dispositivo;
        return respuesta;
    }


    async asignarMarcaDispositivo(asignarMarcaDto: AsignarMarcaDispositivoDto): Promise<MensajeModel> {
        //const dispositivoEditar = Object.assign(dispositivo,dispositivoDto);
        try {
            const {idDispositivo ,marcas} = asignarMarcaDto;

            const repositorioMarca = getRepository<MarcaEntity>(MarcaEntity)
            const repositorioDispositivoMarca = getRepository<DispositivoMarca>(DispositivoMarca)
    
            // Obtener todos las marcas por id
            const lista_marcas = await  repositorioMarca.findByIds(marcas);
             //Obtengo el dipositivo por el id
             const found_dispositivo = await this.dispositivoRepository.findOne(idDispositivo);
             if (!found_dispositivo) {
                 throw new NotFoundException(`Dispositivo con ID:  "${idDispositivo}" no encontrado.`)
             }
             found_dispositivo.marcas = [];//Eliminar de la tabla relacion
             found_dispositivo.marcas.push(...lista_marcas);//Agregar en la tabla relación
             await this.dispositivoRepository.save(found_dispositivo);

             const repository_talleres = getRepository<Taller>(Taller);

             const talleres = await repository_talleres.find({
                 where: {
                     idTaller: Not(`${found_dispositivo.idTaller}`)
                 }
             });
             //Nombre de las marcas para asignar del taller base
             const nombres_marcas_base = lista_marcas.map(value =>{
                 return value.marca;
             })

             if(talleres.length > 0){
                 for (const taller of talleres) {
                    const dispositivos_igual = await this.dispositivoRepository.findOne({
                        where: {                    
                            dispositivo: Equal(found_dispositivo.dispositivo),
                            idDispositivo : Not(`${idDispositivo}`),
                            idTaller: taller.idTaller
                        },
                        relations: ['marcas']
                    });
                    //Buscar marcas por nombre y idtaller
                    let asignar_marcas = await repositorioMarca.find({
                        where: {
                           marca: In(nombres_marcas_base),
                           idTaller: taller.idTaller                     
                        }
                    })
                    //Borrar en la tablas dispositivo_marca
                    dispositivos_igual.marcas = [];
                    //Ingresar nuevos datos
                    dispositivos_igual.marcas.push(...asignar_marcas)
                    await this.dispositivoRepository.save(dispositivos_igual);
                 }
             }
    
            const respuesta = new MensajeModel();
            respuesta.mensaje = ['Se ha actualizado correctamente.'];
            respuesta.data = [];
            return respuesta;
        } catch (error) {
            throw new HttpException(error,HttpStatus.INTERNAL_SERVER_ERROR);
            
        }
       
    }
}
