import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserGoal } from './user-goal.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserGoalService {
    constructor(@InjectRepository(UserGoal) private repo: Repository<UserGoal>) {}

    async create(userId: string, dailyCalories: number, dailyProtein: number, dailyCarbs: number, dailyFats: number) {
        const userGoal = this.repo.create({
            user: { id: userId },
            calories: dailyCalories,
            protein: dailyProtein,
            carbs: dailyCarbs,
            fats: dailyFats
        });
        return await this.repo.save(userGoal);
    }

    async findByUserId(userId: string) {
        return this.repo.findOne({ where: { user: { id: userId } } });
    }

    async update(userId: string, attrs: Partial<UserGoal>) {
        const userGoal = await this.findByUserId(userId);
        if (!userGoal) {
            return null;
        }

        Object.assign(userGoal, attrs);
        return this.repo.save(userGoal);
    }
}
