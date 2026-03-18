import { Test, TestingModule } from '@nestjs/testing';
import { UserGoalService } from './user-goal.service';

describe('UserGoalService', () => {
  let service: UserGoalService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserGoalService],
    }).compile();

    service = module.get<UserGoalService>(UserGoalService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
