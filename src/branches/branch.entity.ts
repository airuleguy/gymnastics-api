import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Athlete } from '../athletes/entities/athlete.entity';

@Entity()
export class Branch {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ unique: true })
  code: string;

  @OneToMany(() => Athlete, athlete => athlete.branch)
  athletes: Athlete[];
} 