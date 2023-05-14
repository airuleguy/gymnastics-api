import { Branches } from '../../branches/branches.enum';
import { Club } from '../../clubs/entities/club.entity';
import { Genders } from '../../genders/genders.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({
  name: 'athlete',
})
@Index(['club', 'branch'])
export class Athlete {
  @PrimaryGeneratedColumn()
  id: number;

  @Index({ unique: true })
  @Column({
    type: String,
    nullable: false,
    length: 50,
  })
  nid: string;

  @Column({
    type: String,
    nullable: false,
    length: 50,
  })
  firstName: string;

  @Column({
    type: String,
    nullable: false,
    length: 50,
  })
  lastName: string;

  @Column({
    type: String,
    nullable: false,
    length: 75,
  })
  email: string;

  @Column({
    type: 'timestamptz',
    nullable: false,
  })
  birthDate: Date;

  @CreateDateColumn()
  dateCreated: Date;

  @Index()
  @Column({
    type: 'timestamptz',
    nullable: false,
  })
  medicalRecordDueDate: Date;

  @Column({
    type: 'enum',
    enum: Genders,
    nullable: false,
  })
  gender: Genders;

  @Column({
    type: 'enum',
    enum: Branches,
    nullable: false,
  })
  branch: Branches;

  @Index()
  @ManyToOne(() => Club, (club: Club) => club.id, {
    cascade: false,
  })
  club: Club;
}
