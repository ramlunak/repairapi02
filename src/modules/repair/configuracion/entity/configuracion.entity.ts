import { UserEntity } from "src/modules/auth/entity/user.entity";
import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, OneToMany, ManyToOne, JoinColumn } from "typeorm";


@Entity('configuracion')
export class Configuracion extends BaseEntity {
    @PrimaryGeneratedColumn()
    idConfiguracion:number;
   
    @Column({type:'int'})
    taller_base:number;
}
