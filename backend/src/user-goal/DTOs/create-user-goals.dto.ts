// create-meal-item.dto.ts
import { IsString, IsNumber } from "class-validator";

export class CreateUserGoalsDto {


  @IsNumber()
  protein: number;
  @IsNumber()
  carbs: number;
  @IsNumber()
  fats: number;
  @IsNumber()
  calories: number;
}