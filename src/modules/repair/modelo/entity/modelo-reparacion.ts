import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, Index } from 'typeorm';

@Entity('modelo_reparacion')
export class  ModeloReparacion extends BaseEntity{
    @PrimaryGeneratedColumn()
    idModeloReparacion: number;

    @Column({type:'int'})
    @Index()
    idModelo:number;     

    @Column({type:'int'})
    @Index()
    idReparacion:number;

    @Column({type:'float'})
    precio:number;

    @Column({type:'boolean',default: 1})
    activo: boolean;

}
