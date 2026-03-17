import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MealItem } from './meal-item.entity';

@Injectable()
export class MealItemService {
  constructor(@InjectRepository(MealItem) private repo: Repository<MealItem>) {}

  async create(mealId: string, name: string, quantity: number, protein: number, carbs: number, fats: number, calories: number) {
    const mealItem = this.repo.create({
      meal: { MealId: mealId },
      name,
      quantity,
      protein,
      carbs,
      fats,
      calories
    });
    return await this.repo.save(mealItem);
  }

  async findAllByMeal(mealId: string) {
    return this.repo.findBy({ meal: { MealId: mealId } });
  }

  findOneById(id: string) {
        return this.repo.findOne({ 
            where: { MealItemId: id }, 
            relations: ['meal', 'meal.user'] 
        });
    }

  async update(id: string, attrs: Partial<MealItem>) {
    const mealItem = await this.findOneById(id);
        if (!mealItem){
            return null;
        }

        Object.assign(mealItem,attrs);
        return this.repo.save(mealItem)
  }

  async delete(id: string) {
    const mealItem = await this.findOneById(id)
        if (!mealItem){
            return null;
        }

        return this.repo.remove(mealItem)
  }

  async getMealTotals(mealId: string) {
    const mealItems = await this.repo.findBy({ meal: { MealId: mealId } });

    const totals = {
      protein: 0,
      carbs: 0,
      fats: 0,
      calories: 0
    };

    (mealItems).forEach(item => {
      totals.protein += item.protein;
      totals.carbs += item.carbs;
      totals.fats += item.fats;
      totals.calories += item.calories;
    });

    return totals;
  }
}