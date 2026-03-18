import { Body, Controller, Get, NotFoundException, Patch, Post } from '@nestjs/common';
import { UserGoalService } from './user-goal.service';
import { CreateUserGoalsDto } from './DTOs/create-user-goals.dto';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { UpdateUserGoalsDto } from './DTOs/update-user-goals.dto';

@Controller('user-goal')
export class UserGoalController {
    constructor(private userGoalService: UserGoalService) {}

    @Post()
    async create(@Body() body: CreateUserGoalsDto, @CurrentUser() currentUser: { userId: string }) {
        return await this.userGoalService.create(currentUser.userId, body.calories, body.protein, body.carbs, body.fats);
    }

    @Get()
    async findByUser(@CurrentUser() currentUser: { userId: string }) {
        return await this.userGoalService.findByUserId(currentUser.userId);
    }

    @Patch()
    async update(@Body() body: UpdateUserGoalsDto, @CurrentUser() currentUser: { userId: string }) {
        const userGoal = await this.userGoalService.findByUserId(currentUser.userId);
        
                    if (!userGoal) throw new NotFoundException("User Goal not found!");
        
                    
            
                    const newUserGoal =  await this.userGoalService.update(currentUser.userId, body)
            
                    if (!newUserGoal){
                        throw new NotFoundException("User Goal not found!")
                    }
            
                    return newUserGoal;
    }
}
