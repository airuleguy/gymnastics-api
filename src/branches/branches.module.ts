import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Branch } from './branch.entity';
import { BranchesController } from './branches.controller';
import { BranchesService } from './branches.service';

@Module({
  imports: [TypeOrmModule.forFeature([Branch])],
  controllers: [BranchesController],
  providers: [BranchesService],
  exports: [BranchesService],
})
export class BranchesModule implements OnModuleInit {
  constructor(private readonly branchesService: BranchesService) {}

  async onModuleInit() {
    // Seed initial branches when the application starts
    await this.branchesService.seedInitialBranches();
  }
} 