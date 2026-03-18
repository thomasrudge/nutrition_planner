// create-meal-item.dto.ts
import { IsString, IsNumber, IsOptional, IsDate } from "class-validator";

export class UpdateUserGoalsDto {

  @IsNumber()
  @IsOptional()
  weight: number;

  @IsNumber()
  @IsOptional()
  height: number;

  @IsDate()
  @IsOptional()
  birthDate: Date;

  @IsString()
  @IsOptional()
  activityLevel: string;

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