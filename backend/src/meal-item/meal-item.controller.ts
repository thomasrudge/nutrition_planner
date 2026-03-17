import { Controller, Get, Post, Patch, Delete, Param, Body, NotFoundException, ForbiddenException } from '@nestjs/common';
import { MealItemService } from './meal-item.service';
import { CreateMealItemDto } from './DTOs/create-meal-item.dto';
import { UpdateMealItemDto } from './DTOs/update-meal-item.dto';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';

@Controller('meal-item')
export class MealItemController {
  constructor(private mealItemService: MealItemService) {}

  @Post()
  create(@Body() body: CreateMealItemDto, @CurrentUser() currentUser: { userId: string }) {
    return this.mealItemService.create(body.mealId, body.name, body.quantity, body.protein, body.carbs, body.fats, body.calories)
  }

  @Get('/meal/:mealId')
  findAllByMeal(@Param('mealId') mealId: string) {
    return this.mealItemService.findAllByMeal(mealId)
  }

  @Get('/totals/:mealId')
  getMealTotals(@Param('mealId') mealId: string) {
    return this.mealItemService.getMealTotals(mealId)
  }

  @Patch('/:id')
  async update(@Param('id') id: string, @Body() body: UpdateMealItemDto, @CurrentUser() currentUser: { userId: string }) {
    const mealItem = await this.mealItemService.findOneById(id);

            if (!mealItem) throw new NotFoundException("Meal not found!");

            if (mealItem.meal.user.id !== currentUser.userId) throw new ForbiddenException("You can only modify your own meals.");
    
            const newMeal =  await this.mealItemService.update(id, body)
    
            if (!newMeal){
                throw new NotFoundException("Meal not found!")
            }
    
            return newMeal;
  }

  @Delete('/:id')
  async delete(@Param('id') id: string, @CurrentUser() currentUser: { userId: string }) {
    const mealItem = await this.mealItemService.findOneById(id);

            if (!mealItem) throw new NotFoundException("Meal not found!");

            if (mealItem.meal.user.id !== currentUser.userId) throw new ForbiddenException("You can only modify your own meals.");
    
            const newMeal =  await this.mealItemService.delete(id)
    
            
    
            return newMeal;
  }
}