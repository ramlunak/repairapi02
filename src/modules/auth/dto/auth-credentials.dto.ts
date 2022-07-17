import { IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { Role } from 'src/modules/repair/roles/entity/role.entity';

export class AuthCredentialsDto {
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  username:string;

  @IsString()
  @MinLength(8,{message:"El valor mínimo es 8 caracteres"})
  @MaxLength(20,{message:"El valor máximo es 20 caracteres"}) 
  password:string;
  
}