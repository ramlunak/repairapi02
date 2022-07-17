import { Blob } from "buffer";

import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Diseno } from "../../diseno/entity/diseno.entity";
import { Dispositivo } from "../../dispositivo/entity/dispositivo.entity";
import { MarcaEntity } from "../../marca/entity/marca.entity";
import { Moneda } from "../../moneda/entity/moneda.entity";
import { OrdenEntity } from "../../orden/entity/orden.entity";
import { Taller } from "../../taller/entity/taller.entity";

@Entity('tarea')
export class Tarea extends BaseEntity{
    @PrimaryGeneratedColumn()
    idTarea:number;

    @Column({type:'text'})
    tarea:string;

    @Column({type:'text'})
    nota:string;    

    @Column({type:'date'})
    fecha:Date;

    @Column({type:'date'})
    fechaLimite: Date;

    @Column({type:'tinyint'})
    estado:number;

    @Column({type:'int'})
    idTaller:number;   
    
    @Column({type:'int'})
    idUsuario:number;
    
    @Column({type:'int',nullable:true})
    asignadaA:number;

    @Column({type:'int'})
    idOrden:number;

    @ManyToOne(()=> OrdenEntity,orden=>orden.tareas,{nullable:true})
    @JoinColumn([{name: "idOrden"}])
    orden:OrdenEntity;
}
