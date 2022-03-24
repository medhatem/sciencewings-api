import { Container as BaseContainer } from 'inversify';
import { buildProviderModule } from 'inversify-binding-decorators';

// istanbul ignore next
export class Container extends BaseContainer {
  // Index signature for propreties to bind Container to.
  [x: string]: any;

  constructor() {
    super({ skipBaseClassChecks: true });
  }

  public initialize(): void {
    this.bind(Container).toConstantValue(this);
    // Reflects all decorators provided by this package and packages them into
    // a module to be loaded by the container
    this.load(buildProviderModule());
  }
}
