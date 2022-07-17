import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('articulo')
export class ArticuloEntity  extends BaseEntity{
    @PrimaryGeneratedColumn()
    idArticulo:number;
   
    @Column({type:'varchar',length:50})
    nombre:string;

    @Column({type:'int'})
    stock:number;

    @Column({type:'decimal'})
    precio:number;

    @Column({type:'int'})
    idTaller:number;
    
}
