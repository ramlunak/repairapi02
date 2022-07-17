import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, Unique, ManyToMany, OneToMany } from 'typeorm';
import { OrdenEntity } from '../../orden/entity/orden.entity';
import { ReparacionEntity } from '../../reparacion/entity/reparacion.entity';

@Entity('modelo')
@Unique(['modelo','idMarca'])
export class ModeloEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    idModelo: number;

    @Column({ type: 'varchar', length: 50 })
    modelo: string;

    @Column({ type: 'text', nullable: true })
    imagen: string;

    @Column({ type: 'int' })
    idMarca: number;

    @Column({ type: 'int' , nullable: true})
    idDispositivo: number;

    @Column({ type: 'boolean' , default: 1})
    activo: boolean;

    @ManyToMany(()=> ReparacionEntity, (reparacion) => reparacion.modelos)   
    reparaciones : ReparacionEntity[];

    @OneToMany(()=>OrdenEntity,orden=>orden.modelo)
    ordenes: OrdenEntity[];

}
