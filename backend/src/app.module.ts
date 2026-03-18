import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/users.entity';
import { MealModule } from './meal/meal.module';
import { Meal } from './meal/meal.entity';
import { MealItemModule } from './meal-item/meal-item.module';
import { MealItem } from './meal-item/meal-item.entity';
import { UserGoalModule } from './user-goal/user-goal.module';
import { UserGoal } from './user-goal/user-goal.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'thomasrudge',
      password: '',
      database: 'medical_app',
      entities: [User, Meal, MealItem, UserGoal],
      synchronize: true,
    }),
    AuthModule,
    UsersModule,
    MealModule,
    MealItemModule,
    UserGoalModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}