import { Meal } from "src/meal/meal.entity";
import {Entity, Column, PrimaryGeneratedColumn, OneToMany,
    
 } from "typeorm";

@Entity()
export class User{

    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column()
    name:string;

    @Column()
    email:string;

    @Column()
    password:string;

    @OneToMany(() => Meal, (meal) => meal.user)
        meals: Meal[];


}