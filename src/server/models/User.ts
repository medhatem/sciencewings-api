import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { container, provideSingleton } from '@di/index';

import { Address } from './Address';
import { BaseModel } from './BaseModel';

@provideSingleton()
@Entity()
export class User extends BaseModel<User> {
  constructor() {
    super();
  }

  static getInstance(): User {
    return container.get(User);
  }
  @PrimaryGeneratedColumn()
  @Index()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({
    unique: true,
  })
  @Index()
  email: string;

  @Column()
  password: string;

  @OneToMany(() => Address, (address) => address.userId)
  addresses: Address[];
}
