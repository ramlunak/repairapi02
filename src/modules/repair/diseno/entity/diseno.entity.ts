import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Imagen } from "../../imagen/entity/imagen.entity";
import { Taller } from "../../taller/entity/taller.entity";

@Entity('diseno')
export class Diseno extends BaseEntity {
    @PrimaryGeneratedColumn()
    idDiseno:number;   

    @Column({type:'varchar',length:30})
    diseno:string;

   /* @OneToMany(type =>Imagen,imagen => imagen.diseno ,{nullable:false,cascade:true})
    imagenes:Imagen[];

    @OneToMany(type =>Taller,taller => taller.diseno ,{nullable:false,cascade:true})
    talleres:Taller[];*/
}
