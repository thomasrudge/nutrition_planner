import { Controller, Get, Post, Patch, Delete, Param, Body, ForbiddenException, NotFoundException } from '@nestjs/common';
import { MealService } from './meal.service';
import { CreateMealDto } from './DTOs/create-meal.dto';
import { UpdateMealDto } from './DTOs/update-meal.dto';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';

@Controller('meal')
export class MealController {
  constructor(private mealService: MealService) {}

  @Post()
  createMeal(@Body() body: CreateMealDto, @CurrentUser() currentUser: { userId: string }) {
    return this.mealService.createMeal(currentUser.userId, body.name, body.date, body.photoUrl, body.notes)
  }

  @Patch('/:id')
  async updateMeal(@Param('id') id: string, @Body() body: UpdateMealDto, @CurrentUser() currentUser: { userId: string }) {
            const meal = await this.mealService.findOneById(id);

            if (!meal) throw new NotFoundException("Meal not found!");

            if (meal.user.id !== currentUser.userId) throw new ForbiddenException("You can only modify your own meals.");
    
            const newMeal =  await this.mealService.editMeal(id, body)
    
            if (!newMeal){
                throw new NotFoundException("Meal not found!")
            }
    
            return newMeal;
  }

  @Delete('/:id')
  async deleteMeal(@Param('id') id: string, @CurrentUser() currentUser: { userId: string }) {
        const meal = await this.mealService.findOneById(id);

        if (!meal) throw new NotFoundException("Meal not found!");

        if (meal.user.id !== currentUser.userId) throw new ForbiddenException("You can only delete your own meals.");

        const newMeal = await this.mealService.deleteMeal(id)

      
        return newMeal
  }

  @Get('/user')
  async findAllByUser(@CurrentUser() currentUser: { userId: string }) {

        const meal = await this.mealService.findAllByUser(currentUser.userId)

        return meal;
  }

  @Get('/date/:date')
  async findByDate(@Param('date') date: string, @CurrentUser() currentUser: { userId: string }) {

        const mealDate = new Date(date);

        const meal = await this.mealService.findByDate(currentUser.userId, mealDate)


        return meal;
  }


  @Get('/:id')
        async findOneById(@Param('id') id: string, @CurrentUser() currentUser: { userId: string }) {

        const meal = await this.mealService.findOneById(id);

        if (!meal) throw new NotFoundException("Meal not found!");

        if (meal.user.id !== currentUser.userId) throw new ForbiddenException("You can only view your own meals.");

        return meal;
}
}