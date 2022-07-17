import { MailerService } from '@nestjs-modules/mailer';
import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { MensajeModel } from 'src/models/mensaje.model';
import {
  Brackets,
  Connection,
  getManager,
  getRepository,
  Repository,
} from 'typeorm';
import { Cliente } from '../../cliente/entity/cliente.entity';
import { OrdenReparacion } from '../../reparacion/entity/orden-reparacion.entity';
import { ReparacionEntity } from '../../reparacion/entity/reparacion.entity';
import { OrdenCrearDto } from '../dtos/orden.crear.dto';
import { OrdenEntity } from '../entity/orden.entity';
import * as PDFDocument from 'pdfkit';

import * as fs from 'fs';
import { Tarea } from '../../tarea/entity/tarea.entity';
import { ModeloEntity } from '../../modelo/entity/modelo.entity';
import { MarcaEntity } from '../../marca/entity/marca.entity';
import { Dispositivo } from '../../dispositivo/entity/dispositivo.entity';
import { ModeloReparacion } from '../../modelo/entity/modelo-reparacion';
import { Pedido } from '../../pedido/entity/pedido.entity';
import { Paginate } from 'src/models/paginate';
import { ConfigService } from '@nestjs/config';
import { Taller } from '../../taller/entity/taller.entity';
import { randomInt } from 'crypto';
import { text } from 'pdfkit';
import { Readable } from 'stream';

@Injectable()
export class OrdenService {
  constructor(
    @InjectRepository(OrdenEntity)
    private readonly ordenRepository: Repository<OrdenEntity>,
    private connection: Connection,
    private readonly mailerService: MailerService,
    private config: ConfigService,
  ) {}

  async getAll(): Promise<OrdenEntity[]> {
    return await this.ordenRepository.find({ relations: ['reparaciones'] });
  }

  async countPorEstado(idTaller: number): Promise<OrdenEntity[]> {
    let idtaller: number = Number(idTaller);
    const query = this.ordenRepository.createQueryBuilder('orden');
    query.where('orden.idTaller = :idtaller', { idtaller });
    query.select('orden.estado as estado');
    query.addSelect('COUNT(*) estadocount');
    query.groupBy('orden.estado');
    const result = await query.getRawMany();

    return result;
  }

  async findOnOrden(idOrden: number,idTaller: number): Promise<MensajeModel> {
    const found_orden = await this.ordenRepository.findOne({
      where:{
        idTaller:idTaller,
        idOrden:idOrden
      }
    });
    if (!found_orden) {
      throw new NotFoundException(`Orden  no encontrada.`);
    }

    const respuesta = new MensajeModel();
    respuesta.mensaje = ['Se ha encontrado una coincidencia.'];
    respuesta.data = found_orden;
    return respuesta;
  }

  async paginate(
    options: IPaginationOptions,
    search: string,
    field: string,
    order: number,
    idTaller: number,
    estado: number,
  ): Promise<Pagination<OrdenEntity>> {
    const orderby = order == 1 ? 'ASC' : 'DESC';

    let idtaller: number = Number(idTaller);
    let estado_filter: number = Number(estado);
    const queryBuilder = this.ordenRepository.createQueryBuilder('orden');
    queryBuilder.leftJoinAndSelect('orden.cliente', 'cliente');
    queryBuilder.leftJoinAndSelect('orden.modelo', 'modelo');
    queryBuilder.leftJoinAndSelect('orden.marca', 'marca');
    queryBuilder.leftJoinAndSelect('orden.dispositivo', 'dispositivo');
    queryBuilder.andWhere(
      new Brackets((qb) => {
        qb.where('modelo.modelo LIKE :search', { search: `%${search}%` })
          .orWhere('orden.fechaCreada LIKE :fechaCreada', {
            fechaCreada: `%${search}%`,
          })
          .orWhere('orden.precio LIKE :search', { search: `%${search}%` })
          .orWhere('cliente.nombre LIKE :search', { search: `%${search}%` });
      }),
    );
    if (estado_filter > 0) {
      queryBuilder.andWhere('orden.estado = :estado', {
        estado: estado_filter,
      });
    }
    queryBuilder.andWhere('orden.idTaller = :idtaller', { idtaller });
    //queryBuilder.orWhere('reparacion.reparacion LIKE :search', { search: `%${search}%` })

    queryBuilder.orderBy('orden.' + field, orderby); // Or whatever you need to do
    queryBuilder.select([
      'orden.idOrden',
      'orden.idTaller',
      'orden.idCliente',
      'orden.patron',
      'orden.pin',
      'modelo.modelo',
      'orden.precio',
      'orden.estado',
      'cliente.nombre',
      'cliente.telefono',
      'marca.marca',
      'dispositivo.dispositivo',
      'orden.fechaCreada',
      'orden.fechaStatus',
      'orden.comentario',
    ]);

    return paginate<OrdenEntity>(queryBuilder, options);
  }

  async paginatePorEstado(
    page: number,
    limit: number,
    search: string,
    field: string,
    order: number,
    idTaller: number,
    estado: number,
    filtro_fecha: string
    ,fechai:string,fechaf:string
  ): Promise<Paginate> {
    const orderby = order == 1 ? 'ASC' : 'DESC';
    let estado_filter: number = Number(estado);
    let idtaller: number = Number(idTaller);
    let paramns: any[] = [idtaller];

    let offset = (page - 1) * limit;
    let query_orderBy = '';
    let query_from = '';
    let query_taller = '';
    let query_estado = '';
    let query_search = '';
    let query_filtro_fecha = '';
    let query_filtroentre_fecha = '';

    let query_select_count = `select count(o.idOrden) as count_total `;
    let query = `select o.idOrden,o.idTaller,o.idCliente,o.patron,o.pin,mo.modelo,o.precio,o.estado,c.nombre,c.telefono,c.dni,m.marca,d.dispositivo,o.fechaCreada,o.fechaStatus,su.username,o.comentario `;
    query_taller = `WHERE o.idTaller = ?  `;
    query_from = `FROM orden as o INNER JOIN cliente as c on o.idCliente = c.idCliente INNER JOIN modelo as mo ON mo.idModelo = o.idModelo  INNER JOIN marca as m ON m.idMarca = o.idMarca  INNER JOIN dispositivo as d ON d.idDispositivo = o.idDispositivo INNER JOIN seg_usuario as su ON su.id = o.idUsuario `;

    query += query_from + query_taller;
    query_select_count += query_from + query_taller;

    if (estado_filter > 0) {
      paramns.push(estado_filter);
      query_estado = `AND o.estado = ? `;
      query += query_estado;
      query_select_count += query_estado;
    }
    if(fechai.length > 0 && fechaf.length > 0) {
      paramns.push(fechai);
      paramns.push(fechaf);
      query_filtroentre_fecha = 'AND o.fechaCreada >= ? AND o.fechaCreada <= ? ';
      query += query_filtroentre_fecha;
      query_select_count += query_filtroentre_fecha;
    }
    if (search.length > 0) {
      let searchs = '%' + search + '%';
      paramns.push(searchs);
      paramns.push(searchs);
      paramns.push(searchs);
      paramns.push(searchs);
      paramns.push(searchs);
      paramns.push(searchs);
      paramns.push(searchs);
      paramns.push(searchs);
      paramns.push(searchs);
      query_search = `AND (o.comentario LIKE ? OR c.telefono LIKE ? OR c.nombre LIKE ? OR o.idOrden LIKE ? OR mo.modelo LIKE ? OR o.fechaCreada LIKE ? OR o.precio LIKE ? OR c.nombre LIKE ? OR su.username LIKE ?)`;
      query += query_search;
      query_select_count += query_search;
    }
    if (filtro_fecha.length > 0) {
      switch (filtro_fecha) {
        case 'today':
          let hoy = new Date();
          paramns.push(hoy.toLocaleDateString('sv-SE'));
          query_filtro_fecha = 'AND o.fechaCreada = ?';
          break;
        case 'yesterday':
          let ayer = new Date();
          ayer.setDate(ayer.getDate() - 1);
          paramns.push(ayer.toLocaleDateString('sv-SE'));
          query_filtro_fecha = 'AND o.fechaCreada = ?';
          break;
        case 'lastweek':
          let lastweek = new Date();
          lastweek.setDate(lastweek.getDate() - lastweek.getDay());
          paramns.push(lastweek.toLocaleDateString('sv-SE'));
          query_filtro_fecha = 'AND o.fechaCreada >= ?';
          break;
        case 'lastmonth':
          let lastmonth = new Date();
          lastmonth.setDate(1);
          paramns.push(lastmonth.toLocaleDateString('sv-SE'));
          query_filtro_fecha = 'AND o.fechaCreada >= ?';
          break;
        default:
          break;
      }
      query += query_filtro_fecha;
      query_select_count += query_filtro_fecha;
    }
    switch (field) {
      case 'dni':
        query_orderBy = ` ORDER BY c.dni` + ` ` + orderby;
        break; 
      case 'telefono':
          query_orderBy = ` ORDER BY c.telefono` + ` ` + orderby;
          break;   
      case 'modelo':
          query_orderBy = ` ORDER BY mo.modelo` + ` ` + orderby;
          break;
      case 'comentario':
        query_orderBy = ` ORDER BY o.comentario` + ` ` + orderby;
          break;
      case 'precio':
        query_orderBy = ` ORDER BY o.precio` + ` ` + orderby;
          break;
      
      case 'estado':
        query_orderBy = ` ORDER BY o.estado` + ` ` + orderby;
          break;
      case 'idOrden':
        query_orderBy = ` ORDER BY o.idOrden` + ` ` + orderby;
          break;

      case 'fechaCreada':
        query_orderBy = ` ORDER BY o.fechaCreada` + ` ` + orderby;
          break;
         

      case 'idCliente':
        query_orderBy = ` ORDER BY c.nombre` + ` ` + orderby;
          break;
          
      case 'idUsuario':
        query_orderBy = ` ORDER BY su.username` + ` ` + orderby;
          break;
        break;    
          break;
      
      default:
        query_orderBy = ` ORDER BY o.estado ASC` + ` ` + `, o.fechaCreada ASC` ;
        break;
    }
    
    query += query_orderBy;
    query_select_count += query_orderBy;
    query += ` LIMIT ` + offset + `,` + limit;

    const count = await this.ordenRepository.query(query_select_count, paramns);
    const queryBuilder = await this.ordenRepository.query(query, paramns);

    return {
      data: queryBuilder,
      count: +count[0].count_total,
    };
  }

  async deleteOrden(id: number): Promise<MensajeModel> {
    const result = await this.ordenRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`La orden con ID "${id}" no se ha encontrado.`);
    }
    const respuesta = new MensajeModel();
    respuesta.mensaje = ['Se ha eliminado correctamente.'];
    return respuesta;
  }

  async saveOrden(orden: OrdenCrearDto): Promise<MensajeModel> {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const {
        idCliente,
        newCliente,
        idTaller,
        idModelo,
        idMarca,
        idDispositivo,
        patron,
        pin,
        precio,
        estado,
        reparacion,
        idUsuario,
        dispositivo,
        marca,
        modelo,
        comentario,
      } = orden;

      let cliente: Cliente = null;
      const repositoryCliente = getRepository<Cliente>(Cliente);
      const repositoryTarea = getRepository<Tarea>(Tarea);
      const repositoryReparaciones =
        getRepository<ReparacionEntity>(ReparacionEntity);
      if (idCliente > 0) {
        cliente = await repositoryCliente.findOne(idCliente);
      } else {
        cliente = new Cliente();
        cliente.nombre = newCliente.nombre;
        cliente.telefono = newCliente.telefono;        
        cliente.idTaller = idTaller;

        await queryRunner.manager.save(cliente);
      }

      const nueva_orden = new OrdenEntity();
      nueva_orden.idCliente = cliente.idCliente;
      nueva_orden.idTaller = idTaller;
      nueva_orden.idModelo = idModelo;
      nueva_orden.idUsuario = idUsuario;
      nueva_orden.idMarca = idMarca;
      nueva_orden.idDispositivo = idDispositivo;
      nueva_orden.patron = patron;
      nueva_orden.comentario = comentario;
      nueva_orden.pin = pin;
      nueva_orden.precio = precio;
      nueva_orden.estado = estado;
      nueva_orden.fechaCreada = new Date();
      await queryRunner.manager.save(nueva_orden);
      if (!nueva_orden) {
        throw new NotFoundException(`Orden no insertada`);
      }

      let tareas: Tarea[] = [];
      let pedidos: Pedido[] = [];

      let fecha_limite = new Date();
      fecha_limite.setDate(fecha_limite.getDate() + 1);

      const reparaciones = await repositoryReparaciones
        .createQueryBuilder('reparacion')
        .innerJoinAndMapOne(
          'reparacion.modelo_reparacion',
          ModeloReparacion,
          'modelo_reparacion',
          'reparacion.idReparacion = modelo_reparacion.idReparacion and modelo_reparacion.idModelo =' +
            idModelo,
        )
        .whereInIds(reparacion)
        .getMany();

      reparaciones.forEach(async (value, index) => {
        let tarea = new Tarea();
        tarea.tarea = value.reparacion;
        tarea.idTaller = idTaller;
        tarea.idOrden = nueva_orden.idOrden;
        tarea.idUsuario = idUsuario;
        tarea.asignadaA = idUsuario;
        tarea.fecha = new Date();
        tarea.fechaLimite = fecha_limite;
        tarea.nota = dispositivo + '-' + marca + '-' + modelo;
        tarea.estado = estado;
        tareas.push(tarea);
        //Pedido
        let pedido = new Pedido();
        pedido.idTaller = idTaller;
        pedido.pedido = value.reparacion;
        pedido.fecha = new Date();
        pedido.estado = estado;
        pedido.nota = dispositivo + '-' + marca + '-' + modelo;
        pedidos.push(pedido);
        const repository_orden_reparacion = new OrdenReparacion();
        repository_orden_reparacion.idOrden = nueva_orden.idOrden;
        repository_orden_reparacion.idReparacion = value.idReparacion;
        await queryRunner.manager.save(repository_orden_reparacion);
      });

      await queryRunner.manager.save(tareas);
      await queryRunner.manager.save(pedidos);

      await queryRunner.commitTransaction();

      const respuesta = new MensajeModel();
      respuesta.mensaje = ['La orden se ha creado correctamente.'];
      respuesta.data = nueva_orden;
      return respuesta;
    } catch (err) {
      // since we have errors lets rollback the changes we made

      await queryRunner.rollbackTransaction();
      throw new NotFoundException(err);
    } finally {
      // you need to release a queryRunner which was manually instantiated
      await queryRunner.release();
    }
  }

  async imprimirPdf(idOrden: number, inc : number): Promise<MensajeModel> {
    try {
      const found_orden = await this.ordenRepository.findOne(idOrden);
      if (!found_orden) throw new NotFoundException('Esta orden no existe');
      const repositoryCliente = getRepository<Cliente>(Cliente);
      const repositoryTaller = getRepository<Taller>(Taller);
      const repositoryDispositivo = getRepository<Dispositivo>(Dispositivo);
      const repositoryMarca = getRepository<MarcaEntity>(MarcaEntity);
      const repositoryModelo = getRepository<ModeloEntity>(ModeloEntity);
      const repositoryReparaciones = getRepository<ReparacionEntity>(ReparacionEntity);
      const repositoryOrdenReparacion = getRepository<OrdenReparacion>(OrdenReparacion);

      const cliente = await repositoryCliente.findOne(found_orden.idCliente);
      const dispositivo = await repositoryDispositivo.findOne(
        found_orden.idDispositivo,
      );
      const modelo = await repositoryModelo.findOne(found_orden.idModelo);
      const marca = await repositoryMarca.findOne(found_orden.idMarca);

      const orden_reparaciones = await repositoryOrdenReparacion.find({
        where: {
          idOrden: idOrden,
        },
      });

      if (orden_reparaciones.length <= 0) {
        throw new NotFoundException(
          'No existen reparaciones asignadas a esta orden.',
        );
      }

      const idReparaciones = orden_reparaciones.map((value) => {
        return value.idReparacion;
      });

      const reparaciones: any[] = await repositoryReparaciones
        .createQueryBuilder('reparacion')
        .innerJoinAndMapOne(
          'reparacion.modelo_reparacion',
          ModeloReparacion,
          'modelo_reparacion',
          'reparacion.idReparacion = modelo_reparacion.idReparacion and modelo_reparacion.idModelo =' +
            found_orden.idModelo,
        )
        .whereInIds(idReparaciones)
        .select([
          'reparacion.idReparacion',
          'reparacion.reparacion',
          'modelo_reparacion.precio',
        ])
        .getMany();

      const taller = await repositoryTaller.findOne(found_orden.idTaller);
      let numero_factura = taller.numero_factura;
      let total_iva = 0;
      let precio_sin_iva = 0;
      let subtotal = 0;
      let base_imponible = taller.iva / 100 + 1;

      for (let i = 0; i < reparaciones.length; i++) {
        precio_sin_iva  = reparaciones[i].modelo_reparacion.precio / base_imponible
        total_iva += reparaciones[i].modelo_reparacion.precio - precio_sin_iva;
        subtotal += precio_sin_iva;
      }

      const apellidoP = cliente.apellidoPaterno ? cliente.apellidoPaterno : '';
      
      const factura = {
        shipping: {
          nombre: cliente.nombre + ' ' + apellidoP ,
          direccion: cliente.direccion ? cliente.direccion : '-',
          dni:cliente.dni,
          telefono:cliente.telefono
        },
        datos_tecnicos: {
          dispositivo: dispositivo.dispositivo,
          marca: marca.marca,
          modelo: modelo.modelo,
        },
        nombre_taller: taller.nombre,
        direccion: taller.direccion ? taller.direccion : '-',
        logo: taller.logo ? taller.logo : 'assets/img/repair.png',
        items: reparaciones,
        subtotal: subtotal,
        iva_taller: taller.iva,
        base_imponible: base_imponible,
        total_iva: total_iva,
        numero_factura: numero_factura,
        fuente:taller.font,
        size:taller.size
      };
      if (inc == 1) { 
        await repositoryTaller.increment({idTaller:found_orden.idTaller},'numero_factura',1)
      }
      const respuesta = new MensajeModel();
      respuesta.mensaje = ['La Factura esta lista para imprimir.'];
      respuesta.data = factura;
      return respuesta;
    } catch (error) {
      const errorResponse = {
        timestamp: new Date().toLocaleString(),
        message: 'Error al imprimir factura.',
        exception: error,
      };
      throw new HttpException(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getReadableStream(buffer: Buffer): Promise<Readable> {
    const stream = new Readable();
    stream.push(buffer);
    stream.push(null);
    return stream;
  }

  async reenviarFactura(idOrden: number): Promise<MensajeModel> {
    try {
      const found_orden = await this.ordenRepository.findOne(idOrden);
      if (!found_orden) throw new NotFoundException('Esta orden no existe.');
      const repositoryCliente = getRepository<Cliente>(Cliente);
      const repositoryTaller = getRepository<Taller>(Taller);
      const repositoryDispositivo = getRepository<Dispositivo>(Dispositivo);
      const repositoryMarca = getRepository<MarcaEntity>(MarcaEntity);
      const repositoryModelo = getRepository<ModeloEntity>(ModeloEntity);
      const repositoryReparaciones =  getRepository<ReparacionEntity>(ReparacionEntity);
      const repositoryOrdenReparacion = getRepository<OrdenReparacion>(OrdenReparacion);

      const cliente = await repositoryCliente.findOne(found_orden.idCliente);

      const dispositivo = await repositoryDispositivo.findOne(
        found_orden.idDispositivo,
      );
      const modelo = await repositoryModelo.findOne(found_orden.idModelo);
      const marca = await repositoryMarca.findOne(found_orden.idMarca);
      const orden_reparaciones = await repositoryOrdenReparacion.find({
        where: {
          idOrden: idOrden,
        },
      });

      if (orden_reparaciones.length <= 0) {
        throw new NotFoundException(
          'No existen reparaciones asignadas a esta orden.',
        );
      }

      const idReparaciones = orden_reparaciones.map((value) => {
        return value.idReparacion;
      });

      const reparaciones: any[] = await repositoryReparaciones
        .createQueryBuilder('reparacion')
        .innerJoinAndMapOne(
          'reparacion.modelo_reparacion',
          ModeloReparacion,
          'modelo_reparacion',
          'reparacion.idReparacion = modelo_reparacion.idReparacion and modelo_reparacion.idModelo =' +
            found_orden.idModelo,
        )
        .whereInIds(idReparaciones)
        .getMany();

      const taller = await repositoryTaller.findOne(found_orden.idTaller);
      let numero_factura = taller.numero_factura;
      let total_iva = 0;
      let total = 0;

      for (let i = 0; i < reparaciones.length; i++) {
        total_iva += (reparaciones[i].modelo_reparacion.precio * taller.iva) / 100;
        total += reparaciones[i].modelo_reparacion.precio - (reparaciones[i].modelo_reparacion.precio * taller.iva) / 100;
      }

      const apellidoP = cliente.apellidoPaterno ? cliente.apellidoPaterno : '';
     
      const factura = {
        shipping: {
          nombre: cliente.nombre + ' ' + apellidoP,
          direccion: cliente.direccion ? cliente.direccion : '-',
          dni:cliente.dni
        },
        datos_tecnicos: {
          dispositivo: dispositivo.dispositivo,
          marca: marca.marca,
          modelo: modelo.modelo,
        },
        nombre_taller: taller.nombre,
        direccion: taller.direccion ? taller.direccion : '-',
        logo: taller.logo ? taller.logo : 'src/images/repair.png',
        items: reparaciones,
        subtotal: total,
        iva_taller: taller.iva,
        total_iva: total_iva,
        numero_factura: numero_factura,
      };

      const pdfBuffer: Buffer = await new Promise(
        async (resolved, rejected) => {
          const doc = new PDFDocument({
            bufferPages: true,
            margin: 50,
          });

          await this.generateHeader(doc, factura);
          await this.generateClienteInformacion(doc, factura);
          await this.generateFacturaTable(doc, factura);
          await this.generateFooter(doc);

          doc.end();
          //doc.pipe(fs.createWriteStream('factura' + found_orden.idOrden + randomInt(8) +'.pdf'));
          const buffer = [];
          doc.on('data', buffer.push.bind(buffer));
          doc.on('end', () => {
            const data = Buffer.concat(buffer);
            resolved(data);
          });
        },
      );
      await this.mailerService.sendMail({
        to: cliente.email,
        //cc: 'royber2020@gmail.com;cfonsecareyna82@gmail.com',
        from: this.config.get<string>('MAIL_USER'), // override default from
        subject: 'Bienvenido a nuestra aplicación!',
        template: 'confirmation', // `.hbs` extension is appended automatically
        attachments: [
          {
            filename: 'factura.pdf',
            content: pdfBuffer,
            contentType: 'application/pdf',
          },
        ],
        context: {
          // ✏️ filling curly brackets with content
          name: cliente.nombre,
        },
      });

     await repositoryTaller.increment({idTaller:found_orden.idTaller},'numero_factura',1)
    } catch (error) {
      const errorResponse = {
        timestamp: new Date().toLocaleString(),
        message: 'El envío de la factura no se realizó correctamente.',
        exception: error,
      };
      throw new HttpException(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    const respuesta = new MensajeModel();
    respuesta.mensaje = ['El envío de la factura fue realizado correctamente.'];

    return respuesta;
  }

  async updateOrden(id: number, orden: OrdenCrearDto): Promise<MensajeModel> {
    const repositoryTarea = getRepository<Tarea>(Tarea);
    const found_orden = await this.ordenRepository.findOne(id, {
      relations: ['tareas'],
    });
    if (!found_orden) throw new NotFoundException('Esta orden no existe.');
    const tareas = found_orden.tareas.map((value) => {
      value.estado = orden.estado;
      return value;
    });

    await repositoryTarea.save(tareas);

    found_orden.fechaStatus = new Date();
    found_orden.estado = orden.estado;
    //console.log(found_orden);
    const respuesta = new MensajeModel();
    respuesta.mensaje = ['Se ha actualizado correctamente la orden.'];
    respuesta.data = await found_orden.save();
    return respuesta;
  }

  //Creación de PDF
  async generateHeader(doc, factura): Promise<void> {
    doc
      .image(factura.logo, 50, 45, { width: 50 })
      .fillColor('#444444')
      .fontSize(20)
      .text(factura.nombre_taller, 110, 57)
      .fontSize(10)
      .text(factura.direccion, 50, 110, { align: 'left' })
      .moveDown();
  }

  async generateFooter(doc): Promise<void> {
    doc
      .fontSize(10)
      .font('Helvetica-Bold')
      .text('Factura', 50, 700, { align: 'center', width: 500 });
  }

  async generateClienteInformacion(
    doc: PDFKit.PDFDocument,
    factura,
  ): Promise<void> {
    let x = 50;

    /*doc
      .fillColor("#444444")
      .fontSize(20)
      .text("Factura", 50, 160);*/

    doc.font('Helvetica-Bold').fontSize(15);

    await this.generateBarraLateral(doc, x, 180, 0.2, 'DATOS DE LA FACTURA');

    //await this.generateHr(doc,x, 185);

    const clinteInformationTop = 200;

    doc
      .fontSize(10)
      .text('Número de Factura:', 50, clinteInformationTop)
      .font('Helvetica-Bold')     
      .text(factura.numero_factura, 150, clinteInformationTop)
      .font('Helvetica-Bold')
      .text('Datos Técnicos:', 50, clinteInformationTop + 15)
      .font('Helvetica-Bold')
      .text(factura.datos_tecnicos.dispositivo + '-' + factura.datos_tecnicos.marca + '-' + factura.datos_tecnicos.modelo, 150, clinteInformationTop+15)
      .text('Fecha de Emisión:', 50, clinteInformationTop + 30)
      .text(await this.formatDate(new Date()), 150, clinteInformationTop + 30)      
      .text('Importe de Factura:', 50, clinteInformationTop + 45)
      .font('Helvetica-Bold')
      .text(
        await this.formatCurrency(factura.subtotal + factura.total_iva),
        150,
        clinteInformationTop + 45,
      )

      .font('Helvetica-Bold')
      .text(`Cliente:${factura.shipping.nombre}`, 300, clinteInformationTop)
      .font('Helvetica')
      .text(
        `Dirección:${factura.shipping.direccion}`,
        300,
        clinteInformationTop + 15,{lineBreak:true}
      )
      .font('Helvetica')
      .text(
        `DNI:${factura.shipping.dni}`,
        300,
        clinteInformationTop + 45,
      )
      /* .text(
        factura.shipping.ciudad +
          ", " +
          factura.shipping.region +
          ", " +
          factura.shipping.pais,
        300,
        clinteInformationTop + 30
      ) */
      .moveDown();

    await this.generateHr(doc, x, 255);
  }

  async generateTableRow(
    doc,
    y,
    item,
    descripcion,
    CostoUnidad,
    cantidad,
    Total,
  ): Promise<void> {
    doc
      .fontSize(10)
      .text(item, 50, y)
      .text(descripcion, 150, y)
      .text(CostoUnidad, 280, y, { width: 90, align: 'right' })
      .text(cantidad, 370, y, { width: 90, align: 'right' })
      .text(Total, 0, y, { align: 'right' });
  }

  async generateFacturaTable(doc: PDFKit.PDFDocument, factura): Promise<void> {
    let i;
    let x = 50;
    const facturaTableTop = 330;

    doc.font('Helvetica-Bold').fontSize(12);
    await this.generateBarraLateral(
      doc,
      x + 200,
      300,
      0.2,
      'RESUMEN DE LA FACTURA',
    );
    await this.generateTableRow(
      doc,
      facturaTableTop,
      '',
      '',
      '',
      'Reparación',
      'Total',
    );
    await this.generateHr(doc, x + 200, facturaTableTop + 20);
    doc.font('Helvetica');
    doc.fillColor('blue', 0.5);
    for (i = 0; i < factura.items.length; i++) {
      const item = factura.items[i];
      const position = facturaTableTop + (i + 1) * 30;
      await this.generateTableRow(
        doc,
        position,
        '',
        '',
        '',
        item.reparacion,
        await this.formatCurrency(
          item.modelo_reparacion.precio -
            (item.modelo_reparacion.precio * factura.iva_taller) / 100,
        ),
      );

      await this.generateHr(doc, x + 200, position + 20);
    }

    const subtotalPosition = facturaTableTop + (i + 1) * 30;
    await this.generateTableRow(
      doc,
      subtotalPosition,
      '',
      '',
      '',
      'Subtotal',
      await this.formatCurrency(factura.subtotal),
    );

    const duePosition = subtotalPosition + 20;
    doc.font('Helvetica-Bold');
    await this.generateTableRow(
      doc,
      duePosition,
      '',
      '',
      '',
      `IVA(${factura.iva_taller}%)`,
      await this.formatCurrency(factura.total_iva),
    );
    const treePosition = duePosition + 20;
    doc.font('Helvetica-Bold');
    await this.generateTableRow(
      doc,
      treePosition,
      '',
      '',
      '',
      'Total a pagar',
      await this.formatCurrency(factura.subtotal + factura.total_iva),
    );
    doc.font('Helvetica');
  }

  async generateHr(doc: PDFKit.PDFDocument, x, y): Promise<void> {
    doc
      .strokeColor('#aaaaaa')
      .lineWidth(1)
      .moveTo(x, y)
      .lineTo(560, y)
      .stroke();
  }

  async generateBarraLateral(
    doc: PDFKit.PDFDocument,
    x,
    y,
    opacidad: number,
    titulo: string,
  ): Promise<void> {
    doc
      .strokeColor('blue', opacidad)
      .lineWidth(20)
      .moveTo(x, y)
      .lineTo(560, y)
      .text(titulo, x, y - 5)
      .stroke();
  }

  async formatCurrency(cents): Promise<string> {
    return cents.toFixed(2) + ' €';
  }

  async formatDate(date): Promise<string> {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    return day + '/' + month + '/' + year;
  }
}
