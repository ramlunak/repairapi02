import {getRepository} from "typeorm";


import {ConfigService} from "@nestjs/config";
import {DEFAULT_ROL} from "../constants";

import { Cuenta } from "src/modules/repair/cuenta/entity/cuenta.entity";

export const setDefaultCuenta = async (config:ConfigService) => {

    const cuentaRepository = getRepository<Cuenta>(Cuenta);

    const defaultCuenta = await cuentaRepository
        .createQueryBuilder().getOne();


        if (!defaultCuenta) {
            const cuenta = await cuentaRepository.create({
                nombre: 'taller',
                apellidoPaterno: 'taller',
                ApellidoMaterno: 'taller',
                email: 'taller@gmail.com',
                dni: '83454556677',
                telefono: '55555555',
                direccion: 'calle a',               
            });
            return await  cuentaRepository.save(cuenta);
        }
    }

