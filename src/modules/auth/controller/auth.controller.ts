/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, Req, UseFilters, UseGuards, ValidationPipe } from '@nestjs/common';
import { AuthCredentialsDto } from '../dto/auth-credentials.dto';
import { AuthService } from '../services/auth.service';

import { GetUser } from '../get-user.decorator';
import { UserEntity } from '../entity/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { CreateUserDto } from '../dto/create-user.dto';
import { QueryExceptionFilter } from 'src/filter/query-exception.filter';
import { AllExceptionFilter } from 'src/filter/all-exception.filter';
import { GlobalExceptionFilter } from 'src/filter/global-exception.filter';
import { CambioPasswordDto } from '../dto/cambio-password.dto';
import { UsersService } from '../users/users.service';
import { UpdateUserDto } from '../dto/update-user.dto';
import { MensajeModel } from 'src/models/mensaje.model';
import { Pagination } from 'nestjs-typeorm-paginate';
import { FilterDto } from '../dto/filter.dto';
import { ForgotPasswordDto } from '../dto/forgot-password.dto';
import { ResetPasswordDto } from '../dto/reset-password.dto';


@Controller('auth')
@UseFilters(new GlobalExceptionFilter())
export class AuthController {
  constructor(
    private authService: AuthService,private userService: UsersService
  ) { }

  @Get('/getall')
  getAllUsuarios(@Query('idCuenta') idCuenta: number,
  @Query('idTaller') idTaller: number,
  @Query('idRol') idRol: number,  
  @Query('search') search: string): Promise<UserEntity[]> {
      return this.userService.getAllUser(idCuenta, idTaller, idRol, search);
  }   
  

  @Get('/getusuarios')   
   getUsuarios(
      @Query('page') page = 1,
      @Query('limit') limit = 10,
      @Query('search') search: string,
      @Query('field') field: string,
      @Query('order') order: number,
  ): Promise<Pagination<UserEntity>> {
      limit = limit > 100 ? 100 : limit;
      return this.userService.paginate({
          page,
          limit,
          route: '/auth',
      }, search, field, order);
  }  

  @Get('/:id')
  getUserById(@Param('id', ParseIntPipe) id: number): Promise<UserEntity> {
    return this.userService.getUserById(id);
  }

  @Get('/getUserPorTaller/:idTaller')
  getUserByTaller(@Param('idTaller',ParseIntPipe) idTaller: number): Promise<UserEntity[]> {
    return this.userService.getUserPorTaller(idTaller);
  }

  @Post('/signup')
  signUp(@Body(ValidationPipe) createUser:CreateUserDto) {

    return this.authService.signUp(createUser);
  }

  @Post('/signin')
  signIn(@Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto): Promise<{ accesToken: string, expirationTime: number , role: string, user: string, idcuenta: number, idtaller: number, idUsuario}> {
    return this.authService.signIn(authCredentialsDto);
  }

  @Patch('/changepasword/:id')
  @UseGuards(AuthGuard('jwt'))
  changePassword(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) changePasswordDto: CambioPasswordDto): Promise<{mensaje:string}> {
    return this.userService.changePassword(id, changePasswordDto);
  }

  @Patch('/update/:id')
  @UseGuards(AuthGuard('jwt'))
  updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updateUserDto: UpdateUserDto): Promise<MensajeModel> {
    return this.userService.updateUser(id, updateUserDto);
  }

  @Delete('/:id')
  @UseGuards(AuthGuard('jwt'))
  deleteUser(@Param('id', ParseIntPipe) id: number): Promise<MensajeModel>  {
    return this.userService.deleteUser(id);
  }

  @Post('/forgotPassword')  
  forgotPassword(@Body(new ValidationPipe) forgotPassword: ForgotPasswordDto): Promise<MensajeModel> {
    return this.authService.forgotPassword(forgotPassword);
  }

  @Post('/resetPassword')  
  resetPassword(@Body(new ValidationPipe) resetPassword: ResetPasswordDto): Promise<MensajeModel> {
    return this.authService.resetPassword(resetPassword);
  }

}
