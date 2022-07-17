/* eslint-disable prettier/prettier */
import { Controller, Get, Param, ParseIntPipe, Post, UseGuards, UseInterceptors, Put, Delete, Body, UploadedFile, NotFoundException, StreamableFile, UseFilters } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ImagenService } from '../services/imagen.service';
import { Imagen } from '../entity/imagen.entity';
import { ImagenCrearDto } from '../dtos/imagen.crear.dto';
import { AuthGuard } from '@nestjs/passport';
import { QueryExceptionFilter } from 'src/filter/query-exception.filter';
import { MensajeModel } from 'src/models/mensaje.model';
import { AllExceptionFilter } from 'src/filter/all-exception.filter';


@Controller('imagen')
@UseFilters(new QueryExceptionFilter(),new AllExceptionFilter())
export class ImagenController {
   constructor(private readonly imagenService: ImagenService) { }

   @Get()
   getImagen(): Promise<Imagen[]> {
      return this.imagenService.getAll();
   }

   @Get('/:id')
   getOneImagen(@Param('id', ParseIntPipe) id: number): Promise<MensajeModel> {
      return this.imagenService.findOnImagen(id);
   }

   @Post()
   @UseInterceptors(FileInterceptor('imagen', {
      fileFilter: (req, file, callback) => {
         if (!file.originalname.match(/\.(jpg|jepg|png|gif)$/)) {
            return callback(new NotFoundException(`Solo se puede seleccionar imagenes`), false);
         }
         callback(null, true);
      }
   }))
   @UseGuards(AuthGuard('jwt'))
   saveImagen(@UploadedFile() imagen: Express.Multer.File, @Body() body): Promise<MensajeModel> {
      
      const imagen_binaria = imagen.buffer;  
      return this.imagenService.saveImagen(imagen_binaria.toString(),body);
   }


   @Put('/:id')
   @UseGuards(AuthGuard('jwt'))
   updateImagen(@Body() imagenDto: ImagenCrearDto, @Param() params): Promise<MensajeModel> {
      return this.imagenService.updateImagen(params.id, imagenDto);
   }

   @Delete('/:id')
   @UseGuards(AuthGuard('jwt'))
   deleteImagen(@Param('id', ParseIntPipe) id: number): Promise<MensajeModel> {
      return this.imagenService.deleteImagen(id);
   }
}
