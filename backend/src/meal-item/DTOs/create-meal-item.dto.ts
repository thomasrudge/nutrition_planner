// create-meal-item.dto.ts
import { IsString, IsNumber } from "class-validator";

export class CreateMealItemDto {
  @IsString()
  mealId: string;
  @IsString()
  name: string;
  @IsNumber()
  quantity: number;
  @IsNumber()
  protein: number;
  @IsNumber()
  carbs: number;
  @IsNumber()
  fats: number;
  @IsNumber()
  calories: number;
}