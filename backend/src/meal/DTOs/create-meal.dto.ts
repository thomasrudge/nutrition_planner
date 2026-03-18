import { Transform } from "class-transformer";
import { IsDate, IsOptional, IsString } from "class-validator";


export class CreateMealDto{



    @IsString()
    name:string;

    @Transform(({ value }) => new Date(value))
    @IsDate()
    date: Date;

    @IsString()
    @IsOptional()
    photoUrl:string;

    @IsOptional()
    @IsString()
    notes:string;
    
}