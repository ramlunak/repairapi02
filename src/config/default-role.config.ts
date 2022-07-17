import {getRepository} from "typeorm";


import {ConfigService} from "@nestjs/config";
import {DEFAULT_ROL} from "../constants";
import { Role } from "src/modules/repair/roles/entity/role.entity";

export const setDefaultRol = async (config:ConfigService) => {

    const roleRepository = getRepository<Role>(Role);

    const defaultRol = await roleRepository
        .createQueryBuilder()        
        .getMany();


        if (defaultRol.length <= 0) {

            let roles = [
                {
                    rol:config.get<string>('ADMINISTRADOR')
                },
                {
                    rol:config.get<string>('CUENTA')
                },
                {
                    rol:config.get<string>('TALLER')
                },
                {
                    rol:config.get<string>('TECNICO')
                }
            ]

            const adminRol = await roleRepository.create(roles);
            return await  roleRepository.save(adminRol)
        }
    }

