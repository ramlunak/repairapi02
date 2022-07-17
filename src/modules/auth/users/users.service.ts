import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../entity/user.entity';
import { CambioPasswordDto } from '../dto/cambio-password.dto';
import { UserRepository } from '../user.repository';
import { UpdateUserDto } from '../dto/update-user.dto';
import { MensajeModel } from 'src/models/mensaje.model';
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';
import { FilterDto } from '../dto/filter.dto';
import { Role } from 'src/modules/repair/roles/entity/role.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository:UserRepository,
  ) {}

  async getAllUser(idCuenta: number, idTaller: number,idRol: number,search: string): Promise<UserEntity[]> {

    try {
      const query = this.userRepository.createQueryBuilder('seg_usuario');
    query.leftJoinAndMapOne('seg_usuario.seg_rol',Role,'rol','seg_usuario.idRol = rol.idRol');
    if(idCuenta && !idTaller){      
      query.where('seg_usuario.idCuenta = :idCuenta',{ idCuenta })
      query.andWhere('seg_usuario.idTaller IS NULL')
    }
    if(idCuenta && idTaller){
      query.where('seg_usuario.idCuenta = :idCuenta',{ idCuenta })
      query.andWhere('seg_usuario.idTaller = :idTaller',{ idTaller })
    }

    if(idRol) {
      query.andWhere('seg_usuario.idRol = :idRol',{ idRol })
    }
   
    if (search) {
      query.andWhere('seg_usuario.username LIKE :search', { search: `%${search}%` })  
    }
    const users = await query.getMany();
    return users;
    } catch (error) {
      console.log(error);
      
    }
    
  }

  async paginate(options: IPaginationOptions,search: string, field: string, order: number): Promise<Pagination<UserEntity>> {
    const orderby = order == 1 ? 'ASC' : 'DESC';

    const queryBuilder = this.userRepository.createQueryBuilder('seg_usuario');    
    queryBuilder.leftJoinAndSelect('seg_usuario.idRol','seg_rol')
    queryBuilder.leftJoinAndSelect('seg_usuario.idCuenta','cuenta')
    queryBuilder.select(['seg_usuario.id','seg_usuario.username','seg_usuario.status','seg_usuario.password','seg_usuario.idCuenta','seg_usuario.idRol','seg_rol.rol','seg_rol.idRol', 'cuenta.idCuenta','cuenta.nombre'])
    queryBuilder.orWhere('seg_usuario.username LIKE :search', { search: `%${search}%` })  
    queryBuilder.orderBy('seg_usuario.' + field, orderby); // Or whatever you need to do

    return paginate<UserEntity>(queryBuilder, options);
  }

  async getUserPorTaller(idTaller: number): Promise<UserEntity[]> {
    const lista_user = await this.userRepository.find({
      where: {
        idTaller: idTaller
      }
    })

    if (lista_user.length === 0) {
      throw new NotFoundException(`No existen usuarios para este taller.`);
    }
    return lista_user;
  }

  async getUserById(id: number): Promise<UserEntity> {
    const user = await this.userRepository.findOne(id);

    if (!user) {
      throw new NotFoundException(`El usuario con ID "${id}" no se ha encontrado.`);
    }
    return user;
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<MensajeModel> {
    const user = await this.userRepository.findOne(id);

    if (!user) throw new NotFoundException('Este usuario no existe.');
    const {email,idCuenta,idRol,idTaller,status,username} = updateUserDto;
    //const userEditar = Object.assign(user, updateUserDto);
    user.email = email;
    if (idCuenta > 0) {
      user.idCuenta = idCuenta;
    }    
    user.idRol = idRol;
    if(idTaller > 0) {
      user.idTaller = idTaller;
    }    
    user.status = status;
    user.username = username;

    const respuesta = new MensajeModel();
    respuesta.mensaje = ['Se ha actualizado correctamente.'];
    respuesta.data = await user.save();
    return respuesta;   
  }

  async deleteUser(id: number): Promise<MensajeModel>  {
    const result = await this.userRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Usuario con ID "${id}" no encontrado.`);
    }

    const respuesta = new MensajeModel();
    respuesta.mensaje = ['Se ha eliminado correctamente.'];
    return respuesta;
  }

  async changePassword(id: number,changePasswordDto: CambioPasswordDto): Promise<{mensaje:string}>{
    const user = await this.userRepository.findOne(id);
    const {password} = changePasswordDto;
    user.password = await this.userRepository.hastPassword(password,user.salt);
    await user.save();
    const mensaje = "Se cambió correctamente la contraseña.";

    return {mensaje};
  } 
}
