import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Meal } from './meal.entity';

@Injectable()
export class MealService {

    constructor(@InjectRepository(Meal) private repo : Repository <Meal>){}
            // Repeat this syntax whenever we want a TypeOrm repo

    async createMeal(userId: string, name: string, date: Date, photoUrl: string, notes: string) {
        const meal = this.repo.create({
            user: { id: userId },
            name,
            date,
            photoUrl,
            notes
        });
        return await this.repo.save(meal);
    }

    async deleteMeal(id: string) {
        const meal = await this.findOneById(id);
        if (!meal) return null;
        
        // Delete meal items first
        await this.repo.query(`DELETE FROM meal_item WHERE "mealMealId" = '${id}'`);
        
        return this.repo.remove(meal);
        }

    async editMeal(id:string, attrs: Partial<Meal>){
        const meal = await this.findOneById(id);
        if (!meal){
            return null;
        }

        Object.assign(meal,attrs);
        return this.repo.save(meal)
    }

    findAllByUser(id: string) {
        return this.repo.find({ 
            where: { user: { id } },
            relations: ['mealItem']
        });
        }

    findByDate(id: string, date: Date) {
        const start = new Date(date);
        start.setUTCHours(0, 0, 0, 0);
        
        const end = new Date(date);
        end.setUTCHours(23, 59, 59, 999);

        console.log('start:', start);
        console.log('end:', end);

        return this.repo
            .createQueryBuilder('meal')
            .leftJoinAndSelect('meal.mealItem', 'mealItem')
            .where('meal.userId = :id', { id })
            .andWhere('meal.date BETWEEN :start AND :end', { start, end })
            .getMany();
    }

    findOneById(id: string) {
        return this.repo.findOne({ 
            where: { MealId: id }, 
            relations: ['user'] 
        });
    }

    async dailyTotals(mealId: string, date: Date) {
        const meals = await this.findByDate(mealId, date);
        let totals = {
            protein: 0,
            carbs: 0,
            fats: 0,
            calories: 0
        };

        meals.forEach(meal => {
            meal.mealItem.forEach(item => {
                totals.protein += item.protein;
                totals.carbs += item.carbs;
                totals.fats += item.fats;
                totals.calories += item.calories;
            });
        });

        return totals;
            
    }
}
