import { SinonStubbedInstance, createStubInstance, restore, stub } from 'sinon';

import { IUser } from '../../server/interface/';
import { UserDao } from '../../server/dao/UserDao';
import { UserService } from '../../server/service/UserService';
import { ValidatonError } from '../../server/errors/ValidationError';
import { container } from '../../server/di';
import intern from 'intern';

const { suite, test, beforeEach, afterEach } = intern.getPlugin('interface.tdd');
const { assert } = intern.getPlugin('chai');

suite(__filename.substring(__filename.indexOf('/server-unit') + '/server-unit/'.length), (): void => {
  let userDaoStub: SinonStubbedInstance<UserDao>;
  let userService: UserService;
  let user: Partial<IUser>;
  beforeEach((): void => {
    userDaoStub = createStubInstance<UserDao>(UserDao);
    userService = new UserService((userDaoStub as any) as UserDao);
    stub(container, 'get').withArgs(UserService).returns(userService);

    user = {
      firstName: 'name',
      lastName: 'last',
      email: 'test@test.com',
    };
  });
  afterEach((): void => {
    restore();
  });
  test('should return a singleton instance', async () => {
    const instance = UserService.getInstance();
    assert.deepEqual(instance, userService);
  });
  test('should call create when body validation passes', async () => {
    await userService.create((user as any) as IUser);
    assert.isTrue(userDaoStub.create.calledOnceWithExactly((user as any) as IUser));
  });
  test('should throw a validation error when validation fails', async () => {
    const userClone = { ...user };
    delete userClone.email;
    try {
      await userService.create((userClone as any) as IUser);
      assert.fail('unexpected success!');
    } catch (error) {
      assert.isTrue(error instanceof ValidatonError);
      assert.equal(error.message, 'the email is a required field');
      // make sure that the create is not called when validation does not pass
      assert.equal(userDaoStub.create.callCount, 0);
    }
  });
});
