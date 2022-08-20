import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'clubs',
})
export class Club {
  @PrimaryGeneratedColumn()
  id: number;
}
