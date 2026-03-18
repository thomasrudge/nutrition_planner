// create-meal-item.dto.ts
import { Transform } from "class-transformer";
import { IsString, IsNumber, IsDate } from "class-validator";

export class CreateUserGoalsDto {

    @IsNumber()
    weight: number;
    
    @IsNumber()
    height: number;

    @Transform(({ value }) => new Date(value))
    @IsDate()
    birthDate: Date;

    @IsString()
    activityLevel: string;

    @IsString()
    gender: string;
}