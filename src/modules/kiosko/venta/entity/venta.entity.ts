import { Transform } from "class-transformer";
import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('venta')
export class VentaEntity extends BaseEntity{
    @PrimaryGeneratedColumn()
    idVenta: number;
   
    @Column()
    idArticulo: number;

    @Column()
    idUsuario: number;

    @Column()
    cantidadVendida: number;

    @Column({type:'decimal',nullable:true})
    precioVentaFinal: number;
    
    @Column({type:"date"}) 
    created_at: Date;
    
}
