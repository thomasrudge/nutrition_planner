import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserGoal } from './user-goal.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserGoalService {
    constructor(@InjectRepository(UserGoal) private repo: Repository<UserGoal>) {}

    async create(userId:string, weight:number, height:number, birthDate:Date, activityLevel:string, gender:string){

        let bmr: number;
        
        if (gender === 'male'){
            bmr = 10 * weight + 6.25 * height - 5 * this.calculateAge(new Date(birthDate)) - 161;
        }
        else if (gender === 'female'){
            bmr = 10 * weight + 6.25 * height - 5 * this.calculateAge(new Date(birthDate)) + 5;
        }
        else {
            throw new Error('Invalid gender value');
        }

        let calories: number;

        if (activityLevel === 'sedentary'){
            calories = Math.round(bmr * 1.2);
        }
        else if (activityLevel === 'lightly active'){
            calories = Math.round(bmr * 1.375);
        }
        else if (activityLevel === 'moderately active'){
            calories = Math.round(bmr * 1.55);
        }
        else if (activityLevel === 'very active'){
            calories = Math.round(bmr * 1.725);
        }

        
      
        else {
            throw new Error('Invalid activity level value');
        }

        

        const protein = Math.round(calories * 0.3 / 4);
        const carbs = Math.round(calories * 0.4 / 4);
        const fats = Math.round(calories * 0.3 / 9);

        const userGoal = this.repo.create({
            user: { id: userId },
            weight,
            height,
            birthDate,
            activityLevel,
            gender,
            calories,
            protein,
            carbs,
            fats
        });

        return await this.repo.save(userGoal);
    }

    async findByUserId(userId: string) {
        return this.repo.findOne({ where: { user: { id: userId } } });
    }

    async update(userId: string, attrs: Partial<UserGoal>) {
            const userGoal = await this.findByUserId(userId);
            if (!userGoal) return null;

            const weight = attrs.weight ?? userGoal.weight;
            const height = attrs.height ?? userGoal.height;
            const birthDate = attrs.birthDate ?? userGoal.birthDate;
            const activityLevel = attrs.activityLevel ?? userGoal.activityLevel;
            const gender = attrs.gender ?? userGoal.gender;

            let bmr: number;
            if (gender === 'male') {
                bmr = 10 * weight + 6.25 * height - 5 * this.calculateAge(new Date(birthDate)) - 161;
            } else if (gender === 'female') {
                bmr = 10 * weight + 6.25 * height - 5 * this.calculateAge(new Date(birthDate)) + 5;
            } else {
                throw new Error('Invalid gender value');
            }

            let calories: number;
            if (activityLevel === 'sedentary') calories = Math.round(bmr * 1.2);
            else if (activityLevel === 'lightly active') calories = Math.round(bmr * 1.375);
            else if (activityLevel === 'moderately active') calories = Math.round(bmr * 1.55);
            else if (activityLevel === 'very active') calories = Math.round(bmr * 1.725);
            else throw new Error('Invalid activity level value');

            const protein = Math.round(calories * 0.3 / 4);
            const carbs = Math.round(calories * 0.4 / 4);
            const fats = Math.round(calories * 0.3 / 9);

            Object.assign(userGoal, attrs, { calories, protein, carbs, fats });
            return this.repo.save(userGoal);
    }

    private calculateAge(birthDate: Date): number {
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
        }
}
