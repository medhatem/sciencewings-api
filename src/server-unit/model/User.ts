import * as mongoose from 'mongoose';

// import { IUser } from '../../server/interface';
// import { KeysEnum } from '../utils/types';
import { User } from '../../server/model/User';
import intern from 'intern';
import { restore } from 'sinon';

// import { validateMongooseSchemaKeys } from '../utils/keysUtil';

// const { Schema } = mongoose;

const { suite, test, beforeEach, afterEach } = intern.getPlugin('interface.tdd');
const { assert, expect } = intern.getPlugin('chai');

suite(__filename.substring(__filename.indexOf('/server-unit') + '/server-unit/'.length), (): void => {
  //   const user: KeysEnum<IUser> = {
  //     lastName: true,
  //     firstName: true,
  //     username: true,
  //     password:true
  //     address: {
  //       appt: true,
  //       zip: true,
  //       city: true,
  //       street: true,
  //     },
  //     _id: true,
  //   };

  beforeEach((): void => {});
  afterEach((): void => {
    restore();
  });
  test('should create the right instance', () => {
    const instance = User.getInstance();
    expect(instance instanceof User);
  });
  test('should create a singleton instance', () => {
    const instance = User.getInstance();
    expect(instance instanceof User);
    assert.deepEqual(new User(), instance);
  });
  suite('initializing schema properties', () => {
    test('should initialize the schema', () => {
      const model = new User();
      expect(model.schema).to.be.undefined;
      const schema = model.initProperties();
      expect(schema instanceof mongoose.Schema).to.be.true;
      console.log('schema paths ', Object.keys(schema.paths));
    });
  });
});
