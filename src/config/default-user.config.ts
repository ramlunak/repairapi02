import {getRepository} from "typeorm";

import * as bcrypt from 'bcrypt';

import {ConfigService} from "@nestjs/config";
import {PASSWORD_ADMIN, USER_ADMIN} from "../constants";
import { UserEntity } from "src/modules/auth/entity/user.entity";
import { Role } from "src/modules/repair/roles/entity/role.entity";
import { Cuenta } from "src/modules/repair/cuenta/entity/cuenta.entity";




export const setDefaultUser = async (config:ConfigService) => {

    const userRepo = getRepository<UserEntity>(UserEntity);
    const roleRepository = getRepository<Role>(Role);
    //const cuentaRepository = getRepository<Cuenta>(Cuenta);



        const defaultUser = await userRepo
            .createQueryBuilder()
            .where('username = :username', {username: 'admin'})
            .getOne()
        if (!defaultUser) {

            const rol = await roleRepository
                .createQueryBuilder()
                .where('rol = :rol', {rol: 'Administrador'})
                .getOne();

           /* const cuenta = await cuentaRepository
                .createQueryBuilder()
                .getOne();*/
                
            const salt = await bcrypt.genSalt();
            const adminUser = userRepo.create({
                username: 'admin',
                salt: salt,
                status: 1,
                password:await bcrypt.hash(config.get<string>(PASSWORD_ADMIN),salt),
                idRol: rol.idRol,
                
            });

            return await userRepo.save(adminUser);
        }


    }

