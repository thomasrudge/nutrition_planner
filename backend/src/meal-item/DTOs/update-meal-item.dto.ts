// update-meal-item.dto.ts
import { IsString, IsNumber, IsOptional } from "class-validator";

export class UpdateMealItemDto {
  @IsOptional()
  @IsString()
  name: string;
  @IsOptional()
  @IsNumber()
  quantity: number;
  @IsOptional()
  @IsNumber()
  protein: number;
  @IsOptional()
  @IsNumber()
  carbs: number;
  @IsOptional()
  @IsNumber()
  fats: number;
  @IsOptional()
  @IsNumber()
  calories: number;
}