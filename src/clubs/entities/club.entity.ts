import { FederationTypes } from '../../federation_types/federation_types.enum';
import { Athlete } from '../../athletes/entities/athlete.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({
  name: 'clubs',
})
export class Club {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: String,
    nullable: false,
    length: 50,
  })
  name: string;

  @Column({
    type: String,
    nullable: true,
    length: 5,
  })
  code: string;

  @Column({
    type: 'enum',
    enum: FederationTypes,
    nullable: false,
  })
  federationType: FederationTypes;

  @OneToMany(() => Athlete, (athlete: Athlete) => athlete.club, {
    cascade: false,
  })
  athletes: Athlete[];

  @CreateDateColumn()
  dateCreated: Date;

  @Column({
    type: String,
    nullable: true,
  })
  logoUrl: string;
}
