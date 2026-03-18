import { User } from "src/users/users.entity";
import {Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn,
    
 } from "typeorm";

@Entity()
export class UserGoal{

    @PrimaryGeneratedColumn('uuid')
    UserGoalId:string;

    @OneToOne(() => User)
    @JoinColumn()
    user: User;

    @Column()
    height:number;

    @Column()
    weight:number;

    @Column()
    birthDate:Date;

    @Column()
    activityLevel:string;

    @Column()
    gender:string;

    @Column()
    protein:number;

    @Column()
    carbs:number;

    @Column()
    fats:number;

    @Column()
    calories:number;
}