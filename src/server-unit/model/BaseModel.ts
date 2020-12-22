import * as mongoose from 'mongoose';

import { restore, spy } from 'sinon';

import { BaseModel } from '../../server/model/BaseModel';
import { IBase } from 'src/server/interface';
import intern from 'intern';

const { Schema } = mongoose;

// const { describe, it } = intern.getPlugin('interface.bdd');
const { suite, test, beforeEach, afterEach } = intern.getPlugin('interface.tdd');
const { assert, expect } = intern.getPlugin('chai');

class TestModel extends BaseModel<IBase> {
  public initProperties(): mongoose.Schema<IBase> {
    return new Schema({
      test: String,
    });
  }
  constructor() {
    super();
  }
}

suite(__filename.substring(__filename.indexOf('/server-unit') + '/server-unit/'.length), (): void => {
  beforeEach((): void => {});
  afterEach((): void => {
    restore();
  });
  test('should not create an instance', () => {
    try {
      BaseModel.getInstance();
      assert.fail('unexpected success!');
    } catch (error) {
      assert.equal(error.message, 'The base model class cannot be instanciated and needs to be overriden!');
    }
  });
  suite('initializing schema', () => {
    test('should initialize the schema', () => {
      const model = new TestModel();
      const propertiesSpy = spy(TestModel.prototype, 'initProperties');
      expect(model.schema).to.be.undefined;
      model.initSchema();
      expect(propertiesSpy.calledOnce);
      expect(model.schema).to.not.be.undefined;
      expect(model.schema instanceof mongoose.Schema).to.be.true;
    });
    test('should initialize the schema and add timestamps', () => {
      const model = new TestModel();
      const propertiesSpy = spy(TestModel.prototype, 'initProperties');
      expect(model.schema).to.be.undefined;
      model.initSchema();
      expect(propertiesSpy.calledOnce);
      expect(model.schema).to.not.be.undefined;
      expect(model.schema instanceof mongoose.Schema).to.be.true;
      expect(model.schema.paths.createdAt).to.not.be.undefined;
      expect(model.schema.paths.updatedAt).to.not.be.undefined;
    });
    test('should initialize the schema and add all defined properties', () => {
      const model = new TestModel();
      const propertiesSpy = spy(TestModel.prototype, 'initProperties');
      expect(model.schema).to.be.undefined;
      model.initSchema();
      expect(propertiesSpy.calledOnce);
      expect(model.schema).to.not.be.undefined;
      expect(model.schema instanceof mongoose.Schema).to.be.true;
      expect(model.schema.paths.test).to.not.be.undefined;
    });
  });

  suite('generating model', () => {
    test('should generate model', () => {
      const model = new TestModel();
      const propertiesSpy = spy(TestModel.prototype, 'initProperties');
      const mongooseModelSpy = spy(mongoose, 'model');

      expect(model.modelClass).to.be.undefined;
      model.generateModel();
      expect(propertiesSpy.calledOnce);
      expect(model.modelClass).to.not.be.undefined;
      expect(model.schema).to.not.be.undefined;
      expect(model.schema instanceof mongoose.Schema).to.be.true;
      expect(mongooseModelSpy.calledOnceWithExactly('TestModel', model.schema)).to.be.true;
      expect(model.modelClass.modelName).to.equal('TestModel');
    });
    test('should generate model with custom name', () => {
      const model = new TestModel();
      const propertiesSpy = spy(TestModel.prototype, 'initProperties');
      const mongooseModelSpy = spy(mongoose, 'model');
      expect(model.modelClass).to.be.undefined;
      model.generateModel('custom');
      expect(propertiesSpy.calledOnce);
      expect(model.modelClass).to.not.be.undefined;
      expect(model.schema).to.not.be.undefined;
      expect(model.schema instanceof mongoose.Schema).to.be.true;
      expect(mongooseModelSpy.calledOnceWithExactly('custom', model.schema)).to.be.true;
      expect(model.modelClass.modelName).to.equal('custom');
    });
  });
});
