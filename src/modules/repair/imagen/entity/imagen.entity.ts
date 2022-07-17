import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn } from "typeorm";
import { Blob } from "buffer";
import { Diseno } from "../../diseno/entity/diseno.entity";

@Entity('imagen')
export class Imagen extends BaseEntity {
    @PrimaryGeneratedColumn()
    idImagen:number;   

    @Column({type:'text'})
    imagen:string;

    @Column({type:'int'})
    idDiseno:number;

    /*@ManyToOne(type => Diseno,diseno=>diseno.imagenes,{nullable:false})
    @JoinColumn([{name: "idDiseno"}])
    diseno:Diseno;*/
    
}