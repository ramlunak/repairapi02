import { UserEntity } from "src/modules/auth/entity/user.entity";
import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, OneToMany, ManyToOne, JoinColumn, Unique } from "typeorm";
import { OrdenEntity } from "../../orden/entity/orden.entity";
import { Taller } from "../../taller/entity/taller.entity";

@Entity('cliente')
@Unique(['telefono','idTaller'])
export class Cliente extends BaseEntity{

    @PrimaryGeneratedColumn()
    idCliente:number;
   
    @Column({type:'varchar',length:50})
    nombre:string;

    @Column({type:'varchar',length:50, nullable: true})
    apellidoPaterno:string;

    @Column({type:'varchar',length:50, nullable: true})
    ApellidoMaterno:string;

    @Column({type:'varchar',length:50,nullable: true})
    dni:string;

    @Column({type:'varchar',length:50,nullable: true})
    email:string;

    @Column({type:'varchar',length:50})
    telefono:string;

    @Column({type:'varchar',length:50,nullable: true})
    direccion:string;
    
    @Column({type:'int'})
    idTaller:number;

    /*@ManyToOne(type => Taller,taller=>taller.clientes,{nullable:false})
    @JoinColumn([{name: "idTaller"}])
    taller:Taller;*/

    @OneToMany(()=>OrdenEntity,orden=>orden.cliente)
    ordenes: OrdenEntity[];

}