import { CreateDateColumn, UpdateDateColumn } from 'typeorm';

export class BaseModel<T = any> {
  static getInstance(): void {
    throw new Error('The base model class cannot be instanciated and needs to be overriden!');
  }

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)' })
  public created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)', onUpdate: 'CURRENT_TIMESTAMP(6)' })
  public updated_at: Date;
}
