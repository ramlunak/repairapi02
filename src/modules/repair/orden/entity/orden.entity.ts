import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Cliente } from "../../cliente/entity/cliente.entity";
import { Dispositivo } from "../../dispositivo/entity/dispositivo.entity";
import { MarcaEntity } from "../../marca/entity/marca.entity";
import { ModeloEntity } from "../../modelo/entity/modelo.entity";
import { ReparacionEntity } from "../../reparacion/entity/reparacion.entity";
import { Tarea } from "../../tarea/entity/tarea.entity";

@Entity('orden')
export class OrdenEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    idOrden: number;

    @Column({ type: 'int' })
    idTaller: number;

    @Column({ type: 'int' })
    idCliente: number;

    @Column({ type: 'int'})
    idModelo: number;

    @Column({ type: 'int'})
    idMarca: number;

    @Column({ type: 'int'})
    idUsuario: number;

    @Column({ type: 'int'})
    idDispositivo: number;

    @Column({ type: 'int', nullable: true })
    patron: number;

    @Column({ type: 'varchar', nullable: true ,length:50})
    pin: string;

    @Column({ type: 'float'})
    precio: number;

    @Column({ type: 'text', nullable: true})
    nota: string;

    @Column({ type: 'int' })
    estado: number;

    @Column({type:"date"}) fechaCreada: Date;

    @Column({type:"date",nullable: true}) fechaStatus: Date;

    @Column({type:"text",nullable: true}) comentario: string;

    @ManyToMany(()=> ReparacionEntity, (reparacion) => reparacion.ordenes)
    @JoinTable({
        name:'orden_reparacion',
        joinColumn:{ 
            name: 'idOrden',            
        }
    ,inverseJoinColumn:{name: 'idReparacion'}
    })   
    reparaciones : ReparacionEntity[];

    @OneToMany(()=>Tarea,tarea=>tarea.orden)
    tareas: Tarea[];

    @ManyToOne(()=>Cliente, cliente=>cliente.ordenes)
    @JoinColumn([{name: "idCliente"}])
    cliente: Cliente;

    @ManyToOne(()=>ModeloEntity, modelo=>modelo.ordenes)
    @JoinColumn([{name: "idModelo"}])
    modelo: ModeloEntity;

    @ManyToOne(()=>MarcaEntity, marca=>marca.ordenes)
    @JoinColumn([{name: "idMarca"}])
    marca: MarcaEntity;

    @ManyToOne(()=>Dispositivo, dispositivo=>dispositivo.ordenes)
    @JoinColumn([{name: "idDispositivo"}])
    dispositivo: Dispositivo;

}
