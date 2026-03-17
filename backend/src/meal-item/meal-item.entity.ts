import { Meal } from "src/meal/meal.entity";
import {Entity, Column, PrimaryGeneratedColumn, ManyToOne,
    
 } from "typeorm";

@Entity()
export class MealItem{

    @PrimaryGeneratedColumn('uuid')
    MealItemId:string;

   
    @ManyToOne(() => Meal, (meal) => meal.mealItem)
    meal: Meal;

    @Column()
    name:string;

    @Column()
    quantity:number;

    @Column('float')
    protein:number;

    @Column('float')
    carbs:number;

    @Column('float')
    fats:number;

    @Column()
    calories:number;
}