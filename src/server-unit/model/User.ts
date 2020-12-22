import * as mongoose from 'mongoose';

import { restore, spy } from 'sinon';

import { User } from '../../server/model/User';
import intern from 'intern';

const { Schema } = mongoose;

// const { describe, it } = intern.getPlugin('interface.bdd');
const { suite, test, beforeEach, afterEach } = intern.getPlugin('interface.tdd');
const { assert, expect } = intern.getPlugin('chai');

suite(__filename.substring(__filename.indexOf('/server-unit') + '/server-unit/'.length), (): void => {
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
