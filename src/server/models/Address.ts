import { Column, Entity, Index, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { BaseModel } from './BaseModel';
import { User } from './User';

@Entity()
export class Address extends BaseModel<Address> {
  @PrimaryGeneratedColumn()
  @Index()
  id: number;

  @Column()
  zip: string;

  @Column()
  city: string;

  @Column()
  street: string;

  @Column()
  appt?: string;

  @ManyToOne(() => User, (user) => user.addresses)
  userId: number;
}
