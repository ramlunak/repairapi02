import { BaseEntity, Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, Unique } from "typeorm";
import { Dispositivo } from "../../dispositivo/entity/dispositivo.entity";
import { OrdenEntity } from "../../orden/entity/orden.entity";
import { Taller } from "../../taller/entity/taller.entity";
@Entity('marca')

export class MarcaEntity extends BaseEntity {

    @PrimaryGeneratedColumn()
    idMarca: number;

    @Column({ type: 'text', nullable: true })
    imagen: string;

    @Column({ type: 'varchar', length: 30 })
    marca: string;

    @Column({ type: 'int' })
    idTaller: number;   

    @ManyToMany(()=> Dispositivo, (dispositivo) => dispositivo.marcas)
   
    dispositivos : Dispositivo[];


    @OneToMany(()=>OrdenEntity,orden=>orden.marca)
    ordenes: OrdenEntity[];

}
