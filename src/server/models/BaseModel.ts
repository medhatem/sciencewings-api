export class BaseModel<T> {
  static getInstance(): void {
    throw new Error('The base model class cannot be instanciated and needs to be overriden!');
  }
}
