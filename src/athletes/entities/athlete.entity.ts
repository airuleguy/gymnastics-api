import { Branch } from '../../branches/branch.entity';
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
    type: 'date',
    nullable: true,
    transformer: {
      to: (value: Date | string | null) => value,
      from: (value: Date | string | null) => value ? value.toString().split('T')[0] : null,
    },
  })
  birthDate: Date;

  @CreateDateColumn()
  dateCreated: Date;

  @Index()
  @Column({
    type: 'date',
    nullable: true,
    transformer: {
      to: (value: Date | string | null) => value,
      from: (value: Date | string | null) => value ? value.toString().split('T')[0] : null,
    },
  })
  medicalRecordDueDate: Date;

  @Column({
    type: 'enum',
    enum: Genders,
    nullable: false,
  })
  gender: Genders;

  @ManyToOne(() => Branch, (branch: Branch) => branch.athletes, {
    nullable: true,
  })
  branch: Branch;

  @Column({
    type: String,
    nullable: true,
  })
  imageUrl: string;

  @Index()
  @ManyToOne(() => Club, (club: Club) => club.id, {
    cascade: false,
  })
  club: Club;
}
