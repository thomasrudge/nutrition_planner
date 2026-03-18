import { Controller, Get, Post, Patch, Delete, Param, Body, ForbiddenException, NotFoundException, UseInterceptors, UploadedFile } from '@nestjs/common';
import { MealService } from './meal.service';
import { CreateMealDto } from './DTOs/create-meal.dto';
import { UpdateMealDto } from './DTOs/update-meal.dto';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import * as fs from 'fs';
import axios from 'axios';
import { MealItemService } from 'src/meal-item/meal-item.service';

@Controller('meal')
export class MealController {
  constructor(private mealService: MealService, private mealItemService: MealItemService) {}

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


    @Post('/analyze')
    @UseInterceptors(FileInterceptor('file'))
    async analyzeMeal( @UploadedFile() file: Express.Multer.File, @Body() body: CreateMealDto,@CurrentUser() currentUser: { userId: string }) {

            
            // 1. Save the image locally
            const filePath = `./uploads/${file.originalname}`;
            fs.writeFileSync(filePath, file.buffer);
            // 2. Send image to Python server
            const returnedData = await axios.post('http://localhost:8001/analyze', {
                imagePath: filePath
            }).then(response => response.data)
            .catch(error => {
                console.error('Error analyzing meal:', error);
                throw new NotFoundException("Error analyzing meal");
            });
            // 3. Create Meal record
            const meal = await this.mealService.createMeal(currentUser.userId, body.name, body.date, filePath, body.notes)
            // 4. Create MealItem records
            for (const item of returnedData.items) {
                
                const newMealItem = await this.mealItemService.create(meal.MealId, item.name, item.quantity, item.protein, item.carbs, item.fats, item.calories)
            }
            // 5. Return meal with items
            const savedItems = await this.mealItemService.findAllByMeal(meal.MealId);
            
            return { meal, items: savedItems };
        }

    @Get('/daily-totals/:date')
        async getDailyTotals(@Param('date') date: string, @CurrentUser() currentUser: { userId: string }) {
        const mealDate = new Date(date);
        return this.mealService.dailyTotals(currentUser.userId, mealDate);
        }

    @Get('/:id')
    async findOneById(@Param('id') id: string, @CurrentUser() currentUser: { userId: string }) {

        const meal = await this.mealService.findOneById(id);

        if (!meal) throw new NotFoundException("Meal not found!");

        if (meal.user.id !== currentUser.userId) throw new ForbiddenException("You can only view your own meals.");

        return meal;
    }   
}