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

    async deleteMeal(id:string){
        const meal = await this.findOneById(id)
        if (!meal){
            return null;
        }

        return this.repo.remove(meal)
    }

    async editMeal(id:string, attrs: Partial<Meal>){
        const meal = await this.findOneById(id);
        if (!meal){
            return null;
        }

        Object.assign(meal,attrs);
        return this.repo.save(meal)
    }

    findAllByUser(id:string){
        return this.repo.findBy({ user: { id } })
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
}
