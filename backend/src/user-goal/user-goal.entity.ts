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

    @Column('float')
    protein:number;

    @Column('float')
    carbs:number;

    @Column('float')
    fats:number;

    @Column()
    calories:number;
}