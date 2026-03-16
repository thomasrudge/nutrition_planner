import { IsDate, IsString, IsOptional } from "class-validator";


export class UpdateMealDto{

    @IsOptional()
    @IsString()
    name:string;

    @IsOptional()
    @IsDate()
    date:Date;

    @IsOptional()
    @IsString()
    photoUrl:string;

    @IsOptional()
    @IsString()
    notes:string;
}