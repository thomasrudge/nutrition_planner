import { Test, TestingModule } from '@nestjs/testing';
import { MealItemService } from './meal-item.service';

describe('MealItemService', () => {
  let service: MealItemService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MealItemService],
    }).compile();

    service = module.get<MealItemService>(MealItemService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
