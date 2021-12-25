import { SinonStubbedInstance, createStubInstance, restore, stub } from 'sinon';

import { IUser } from '../../server/interface';
import { UserDao } from '@modules/users/daos/UserDao';
import { UserRO } from '@modules/users/routes/RequestObject';
import { UserService } from '@modules/users/services/UserService';
import { ValidatonError } from '../../server/errors/ValidationError';
import { container } from '../../server/di';
import intern from 'intern';

const { suite, test, beforeEach, afterEach } = intern.getPlugin('interface.tdd');
const { assert } = intern.getPlugin('chai');

suite(__filename.substring(__filename.indexOf('/server-test') + '/server-test/'.length), (): void => {
  let userDaoStub: SinonStubbedInstance<UserDao>;
  let userService: UserService;
  let user: Partial<IUser>;
  beforeEach((): void => {
    userDaoStub = createStubInstance<UserDao>(UserDao);
    userService = new UserService(userDaoStub as any as UserDao);
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
    await userService.signup(user as any as UserRO);
    assert.isTrue(userDaoStub.signup.calledOnceWithExactly(user as any as UserRO));
  });
  test('should throw a validation error when validation fails', async () => {
    const userClone = { ...user };
    delete userClone.email;
    try {
      await userService.signup(userClone as any as UserRO);
      assert.fail('unexpected success!');
    } catch (error) {
      assert.isTrue(error instanceof ValidatonError);
      assert.equal(error.message, 'the email is a required field');
      // make sure that the create is not called when validation does not pass
      assert.equal(userDaoStub.signup.callCount, 0);
    }
  });
});
