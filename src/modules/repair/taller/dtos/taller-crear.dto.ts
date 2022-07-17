import { IsEmail, IsPhoneNumber, IsString, IsNotEmpty, IsInt, IsEmpty } from "class-validator";

export class TallerCrearDto{

    @IsNotEmpty()
    @IsString()
    nombre:string;

    //@IsString()
    //@IsEmpty()
    direccion:string;

    //@IsString()
    //@IsEmpty()
    detalles:string;

    //@IsString()
   // @IsEmpty()
    condiciones:string;

    //@IsEmail()
    //@IsEmpty()
    email:string;

    //@IsString()
    //@IsEmpty()
    informacionAdicional:string;

    //@IsString()
   // @IsEmpty()
    ipImpresora:string;
   
    //@IsInt()
   // @IsEmpty()
    idMoneda:number;

    //@IsInt()
    //@IsEmpty()
    idDiseno:number;

    iva:number;

    numero_factura:number;

    logo:string;

    telefono1:string;

    telefono2:string;

    nif:string;

    font:string;

    size:string;

    @IsNotEmpty()
    @IsInt()
    idCuenta:number;
}