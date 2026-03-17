import { MealItem } from "src/meal-item/meal-item.entity";
import { User } from "src/users/users.entity";
import {Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany,
    
 } from "typeorm";

@Entity()
export class Meal{

    @PrimaryGeneratedColumn('uuid')
    MealId:string;

    // UserId
    @ManyToOne(() => User, (user) => user.meals)
    user: User;

    @OneToMany(() => MealItem, (mealItem) => mealItem.meal)
            mealItem: MealItem[];

    @Column()
    name:string;

    @Column()
    date:Date;

    @Column()
    photoUrl:string;

    @Column()
    notes:string;

}