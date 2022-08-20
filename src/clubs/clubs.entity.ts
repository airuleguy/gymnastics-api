import { FederationTypes } from 'src/federation_types/federation_types.enum';
import { Gymnast } from 'src/gymnasts/gymnasts.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

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

  @OneToMany(() => Gymnast, (gymnast: Gymnast) => gymnast.id, {
    cascade: false,
  })
  gymnasts: Gymnast[];
}
