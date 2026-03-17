import { Module } from '@nestjs/common';
import { MealItemService } from './meal-item.service';
import { MealItemController } from './meal-item.controller';
import { MealItem } from './meal-item.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([MealItem])],
  providers: [MealItemService],
  controllers: [MealItemController]
})
export class MealItemModule {}
