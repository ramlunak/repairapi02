import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, Index } from 'typeorm';

@Entity('orden_reparacion')
export class OrdenReparacion extends BaseEntity  {
    @PrimaryGeneratedColumn()
    idOrdenReparacion: number;

    @Column({type:'int'})
    @Index()
    idOrden:number;

    @Column({type:'int'})
    @Index()
    idReparacion:number;

}
