import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Taller } from "../../taller/entity/taller.entity";

@Entity('moneda')
export class Moneda extends BaseEntity {
    @PrimaryGeneratedColumn()
    idMoneda:number;   

    @Column({type:'varchar',length:20})
    moneda:string;

    @Column({type:'varchar',length:1})
    simbolo:string;

    /*@OneToMany(type =>Taller,taller => taller.diseno ,{nullable:false,cascade:true})
    talleres:Taller[];*/
}
