import { createParamDecorator } from '@nestjs/common';
import { UserEntity } from './entity/user.entity';


export  const GetUser = createParamDecorator((data,req):UserEntity=>{
return data;
});