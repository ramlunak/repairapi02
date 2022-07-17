import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('compra')
export class CompraEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    idCompra:number;

    @Column({type:'int'})
    idArticulo:number;  

    @Column({type:'int'})
    cantidad:number;

    @Column()
    idUsuario: number;

    @Column({type:'decimal'})
    precioCompra:number;

    @Column({type:'int'})
    idTaller:number;

    @Column({type:"date"}) 
    created_at: Date;

}
