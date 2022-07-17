import { UserEntity } from 'src/modules/auth/entity/user.entity';
import {
    BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn, Unique, CreateDateColumn,
    UpdateDateColumn, ManyToMany, JoinTable
} from 'typeorm';


@Entity('seg_rol')
export class Role extends BaseEntity {

    @PrimaryGeneratedColumn()
    idRol:number;
  
    @Column({type:'varchar',length:20})
    rol:string;   
  
    /*@OneToMany(() => UserEntity, user => user.role,{eager:true,nullable:false})
    users: UserEntity[];*/

    @CreateDateColumn() created_at: Date;  
  
    @UpdateDateColumn() modified_at: Date; 
}
