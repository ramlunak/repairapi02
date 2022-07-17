import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity('taller')
export class Taller extends BaseEntity{
    @PrimaryGeneratedColumn()
    idTaller:number;

    @Column({type:'varchar',length:100})
    nombre:string;

    @Column({type:'text',nullable:true})
    direccion:string;

    @Column({type:'text',nullable:true})
    detalles:string;

    @Column({type:'text',nullable:true})
    condiciones:string;

    @Column({type:'text',nullable:true})
    informacionAdicional:string;
   
    @Column({type:'varchar',length:50,nullable:true})
    email:string;

    @Column({type:'varchar',length:15,nullable:true})
    ipimpresora:string;

    @Column({type:'varchar',length:50,nullable:true})
    nif:string;

    @Column({type:'varchar',length:50,nullable:true})
    telefono1:string;

    @Column({type:'varchar',length:50,nullable:true})
    telefono2:string;

    @Column({type:'text',nullable:true})
    logo:string;
    
    @Column({type:'int',nullable:true})
    idDiseno:number;

    @Column({type:'int',nullable:true})
    idMoneda:number;

    @Column({type:'int'})
    idCuenta:number;

    @Column({type:'decimal'})
    iva:number;

    @Column({type:'int',default: 1})
    numero_factura:number;

    @Column({type:'varchar',length:50})
    font:string;

    @Column({type:'varchar',length:5})
    size:string;
}
