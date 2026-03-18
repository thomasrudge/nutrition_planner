import { Module } from '@nestjs/common';
import { UserGoalController } from './user-goal.controller';
import { UserGoalService } from './user-goal.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserGoal } from './user-goal.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserGoal])],
  controllers: [UserGoalController],
  providers: [UserGoalService]
})
export class UserGoalModule {}
