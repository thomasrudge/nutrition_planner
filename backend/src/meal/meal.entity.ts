import { User } from "src/users/users.entity";
import {Entity, Column, PrimaryGeneratedColumn, ManyToOne,
    
 } from "typeorm";

@Entity()
export class Meal{

    @PrimaryGeneratedColumn('uuid')
    id:string;

    // UserId
    @ManyToOne(() => User, (user) => user.meals)
    user: User;

    @Column()
    name:string;

    @Column()
    date:Date;

    @Column()
    photoUrl:string;

    @Column()
    notes:string;

}