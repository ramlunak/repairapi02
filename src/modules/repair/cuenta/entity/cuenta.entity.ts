import { UserEntity } from "src/modules/auth/entity/user.entity";
import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, OneToMany } from "typeorm";
import { Taller } from "../../taller/entity/taller.entity";

@Entity('cuenta')
export class Cuenta{

    @PrimaryGeneratedColumn()
    idCuenta:number;
   
    @Column({type:'varchar',length:50})
    nombre:string;

    @Column({type:'varchar',length:50,nullable:true})
    apellidoPaterno:string;

    @Column({type:'varchar',length:50,nullable:true})
    ApellidoMaterno:string;

    @Column({type:'varchar',length:50,nullable:true})
    dni:string;

    @Column({type:'varchar',length:50,nullable:true})
    email:string;

    @Column({type:'varchar',length:50,nullable:true})
    telefono:string;

    @Column({type:'varchar',length:50,nullable:true})
    direccion:string;   

    /*@OneToMany(() => UserEntity, user => user.cuenta,{nullable:false})
    users: UserEntity[];

    @OneToMany(type =>Taller,taller => taller.cuenta,{nullable:false,cascade:true})
    talleres:Taller[];*/

}