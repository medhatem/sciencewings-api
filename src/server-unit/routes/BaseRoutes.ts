import * as express from 'express';

import { createSandbox, restore } from 'sinon';

import { BaseRoutes } from '../../server/routes/BaseRoutes';
import { Route } from '../../server/routes/RouteTypes';
import intern from 'intern';

const { suite, test, beforeEach, afterEach } = intern.getPlugin('interface.tdd');
const { assert, expect } = intern.getPlugin('chai');
class TestRoutes extends BaseRoutes {
  public routes: Route[] = [{ method: 'post', url: '/api/v1/route/test', handler: this.test }];
  constructor(router: express.Router) {
    super(router);
    this.bindRoutes();
  }

  public async test(req: express.Request, res: express.Response) {
    console.log('called');
  }
}

suite(__filename.substring(__filename.indexOf('/server-unit') + '/server-unit/'.length), (): void => {
  let router: any;
  beforeEach((): void => {
    router = {
      get(...args: any): any {
        return null;
      },
      post(...args: any): any {
        return null;
      },
      delete(): any {
        return null;
      },
      put(): any {
        return null;
      },
    };
    const sandbox = createSandbox();
    sandbox.spy(router);
    new TestRoutes((router as any) as express.Router);
  });
  afterEach((): void => {
    restore();
  });
  test('should not create an instance', () => {
    try {
      BaseRoutes.getInstance();
      assert.fail('unexpected success!');
    } catch (error) {
      assert.equal(error.message, 'BaseRoutes class cannot be instanciated and must be overriden');
    }
  });
  test('should bind the defined routes', () => {
    expect(router.post.callCount).to.equal(1);
    assert.deepEqual(router.post.getCalls()[0].args[0], '/api/v1/route/test');
  });
});
