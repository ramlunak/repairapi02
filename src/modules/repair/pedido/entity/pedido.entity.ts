import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Taller } from "../../taller/entity/taller.entity";

@Entity('pedido')
export class Pedido extends BaseEntity {
    @PrimaryGeneratedColumn()
    idPedido:number;   

    @Column({type:'text'})
    pedido:string;    

    @Column({type:'date'})
    fecha:Date;

    @Column({type:'tinyint'})
    estado:number;

    @Column({type:'int'})
    idTaller:number;

    @Column({type:'text',nullable: true})
    nota:string;

    /*@ManyToOne(type => Taller,taller=>taller.dispositivos,{nullable:false})
    @JoinColumn([{name: "idTaller"}])
    taller:Taller;*/
}
