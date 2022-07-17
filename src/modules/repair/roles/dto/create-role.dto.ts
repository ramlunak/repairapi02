import { IsNotEmpty, IsString } from 'class-validator';


export class CreateRoleDto {
    @IsNotEmpty()
    @IsString()    
    rol: string;
} 