// create-meal-item.dto.ts
import { IsString, IsNumber, IsOptional } from "class-validator";

export class UpdateUserGoalsDto {

  

  @IsNumber()
  @IsOptional()
  protein: number;

  @IsNumber()
  @IsOptional()
  carbs: number;

  @IsNumber()
  @IsOptional()
  fats: number;

  @IsNumber()
  @IsOptional()
  calories: number;
}