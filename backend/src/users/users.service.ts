import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './users.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {

    constructor(@InjectRepository(User) private repo : Repository <User>){}
    // Repeat this syntax whenever we want a TypeOrm repo
  
    findOneById(id:string){    
            return this.repo.findOneBy({id})
    }


    findOneByEmail(email:string){
            return this.repo.findOneBy({email})
    }


    async create(name:string, email:string, password:string){
        const user = this.repo.create({name, email, password});
        return await this.repo.save(user);
    }


    async update(id:string, attrs: Partial<User>){

        const user = await this.findOneById(id);
        if (!user){
            return null;
        }

        Object.assign(user,attrs);
        return this.repo.save(user)

    }

 
    async delete(id: string) {
        const user = await this.findOneById(id);
        if (!user) return null;

        await this.repo.query(`DELETE FROM meal_item WHERE "mealMealId" IN (SELECT "MealId" FROM meal WHERE "userId" = '${id}')`);
        await this.repo.query(`DELETE FROM meal WHERE "userId" = '${id}'`);
        await this.repo.query(`DELETE FROM user_goal WHERE "userId" = '${id}'`);

        return this.repo.remove(user);
    }


}
