import { Test, TestingModule } from '@nestjs/testing';
import { ArticuloController } from './articulo.controller';
import { ArticuloService } from '../service/articulo.service';

describe('ArticuloController', () => {
  let controller: ArticuloController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ArticuloController],
      providers: [ArticuloService],
    }).compile();

    controller = module.get<ArticuloController>(ArticuloController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
