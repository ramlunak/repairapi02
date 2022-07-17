import { BaseEntity, Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, Unique } from "typeorm";
import { MarcaEntity } from "../../marca/entity/marca.entity";
import { OrdenEntity } from "../../orden/entity/orden.entity";
import { Taller } from "../../taller/entity/taller.entity";

@Entity('dispositivo')
@Unique(['dispositivo','idTaller'])
export class Dispositivo extends BaseEntity {
    @PrimaryGeneratedColumn()
    idDispositivo:number;   

    @Column({type:'text',nullable: true})
    imagen:string;

    @Column({type:'varchar',length:50})
    dispositivo:string;

    @Column({type:'int'})
    idTaller:number;

    @Column({type:'boolean'})
    activo: boolean;

    /*@ManyToOne(type => Taller,taller=>taller.dispositivos,{nullable:false})
    @JoinColumn([{name: "idTaller"}])
    taller:Taller;*/

    @ManyToMany(()=> MarcaEntity, (marca) => marca.dispositivos)
    @JoinTable({
        name:'dispositivo_marca',
        joinColumn:{ 
            name: 'idDispositivo',
        }
    ,inverseJoinColumn:{name: 'idMarca'}
    })
    marcas : MarcaEntity[];

    @OneToMany(()=>OrdenEntity,orden=>orden.dispositivo)
    ordenes: OrdenEntity[];

}