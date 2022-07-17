import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from 'typeorm';
import * as bcrypt from 'bcrypt';


import { Role } from 'src/modules/repair/roles/entity/role.entity';
import { Cuenta } from 'src/modules/repair/cuenta/entity/cuenta.entity';

@Entity("seg_usuario")
@Unique(['username'])
export class UserEntity extends BaseEntity{
  @PrimaryGeneratedColumn()
  id:number;

  @Column()
  username:string;

  @Column()
  password:string;

  @Column({unique: true})
  email:string;

  @Column()
  salt:string;

  @Column({type:'int',nullable: true})
  idCuenta:number;

  @Column({type:'int'})
  idRol:number;

  @Column({type:'smallint'})
  status:number;

  @Column({type:'int',nullable:true})
  idTaller:number;

  @CreateDateColumn({type:"timestamp"}) created_at: Date;

  @UpdateDateColumn({type:"timestamp"}) modified_at: Date;


 /* @ManyToOne(() => Role, role=>role.users,{eager:false,nullable:false})
  @JoinColumn([{name: "idRol"}])
  role: Role;

  @ManyToOne(()=> Cuenta, cuenta=>cuenta.users,{eager:false,nullable:false})
  @JoinColumn([{name: "idCuenta"}])
  cuenta: Cuenta;*/

  async validatePassword(password:string):Promise<boolean>{
    const hash = await bcrypt.hash(password,this.salt);
    return hash === this.password;
  }
}