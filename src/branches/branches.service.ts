import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Branch } from './branch.entity';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';

@Injectable()
export class BranchesService {
  constructor(
    @InjectRepository(Branch)
    private branchesRepository: Repository<Branch>,
  ) {}

  async create(createBranchDto: CreateBranchDto): Promise<Branch> {
    const branch = this.branchesRepository.create(createBranchDto);
    return this.branchesRepository.save(branch);
  }

  async findAll(): Promise<Branch[]> {
    return this.branchesRepository.find();
  }

  async findOne(id: number): Promise<Branch> {
    const branch = await this.branchesRepository.findOne({ where: { id } });
    if (!branch) {
      throw new NotFoundException(`Branch with ID ${id} not found`);
    }
    return branch;
  }

  async update(id: number, updateBranchDto: UpdateBranchDto): Promise<Branch> {
    const branch = await this.findOne(id);
    this.branchesRepository.merge(branch, updateBranchDto);
    return this.branchesRepository.save(branch);
  }

  async remove(id: number): Promise<void> {
    const branch = await this.findOne(id);
    await this.branchesRepository.remove(branch);
  }

  // Seed initial branches if none exist
  async seedInitialBranches(): Promise<void> {
    const count = await this.branchesRepository.count();
    if (count === 0) {
      await this.branchesRepository.save([
        { name: 'Artistic', code: 'artistic' },
        { name: 'Aerobic', code: 'aerobic' },
        { name: 'Rhythmic', code: 'rhythmic' },
      ]);
    }
  }
} 