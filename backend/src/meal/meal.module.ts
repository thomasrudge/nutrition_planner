import { Module } from '@nestjs/common';
import { MealService } from './meal.service';
import { MealController } from './meal.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Meal } from './meal.entity';
import { MealItemModule } from 'src/meal-item/meal-item.module';
import { SupabaseService } from 'src/supabase/supabase.service';

@Module({
  imports: [TypeOrmModule.forFeature([Meal]) , MealItemModule],
  providers: [MealService, SupabaseService],
  controllers: [MealController]
})
export class MealModule {}
