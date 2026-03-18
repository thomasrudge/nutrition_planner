import { Test, TestingModule } from '@nestjs/testing';
import { UserGoalController } from './user-goal.controller';

describe('UserGoalController', () => {
  let controller: UserGoalController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserGoalController],
    }).compile();

    controller = module.get<UserGoalController>(UserGoalController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
