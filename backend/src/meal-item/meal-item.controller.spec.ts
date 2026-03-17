import { Test, TestingModule } from '@nestjs/testing';
import { MealItemController } from './meal-item.controller';

describe('MealItemController', () => {
  let controller: MealItemController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MealItemController],
    }).compile();

    controller = module.get<MealItemController>(MealItemController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
