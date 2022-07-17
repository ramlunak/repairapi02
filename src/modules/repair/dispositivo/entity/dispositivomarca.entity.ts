import { BaseEntity, Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity('dispositivo_marca')
export class DispositivoMarca extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({type:'int'})
    @Index()
    idDispositivo:number;     

    @Column({type:'int'})
    @Index()
    idMarca:number;
    
    @Column({ type: 'boolean', default: 1 })
    activo: boolean;
    
}