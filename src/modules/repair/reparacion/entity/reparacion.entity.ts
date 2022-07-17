import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToMany, JoinTable } from 'typeorm';
import { ModeloEntity } from '../../modelo/entity/modelo.entity';
import { OrdenEntity } from '../../orden/entity/orden.entity';

@Entity('reparacion')
export class ReparacionEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    idReparacion: number;

    @Column({ type: 'text',nullable: true})
    imagen: string;

    @Column({ type: 'varchar', length: 100 })
    reparacion: string;

    @Column({ type: 'int' })
    idTaller: number;

    @Column({ type: 'int' })
    idDispositivo: number;

    @ManyToMany(()=> OrdenEntity, (orden) => orden.reparaciones)   
    ordenes : OrdenEntity[];

    @ManyToMany(()=> ModeloEntity, (modelo) => modelo.reparaciones,{eager:true})
    @JoinTable({
        name:'modelo_reparacion',
        joinColumn:{ 
            name: 'idReparacion',
        }
    ,inverseJoinColumn:{name: 'idModelo'}
    })
    modelos : ModeloEntity[];
}
