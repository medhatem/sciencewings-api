import { BaseModel } from '@modules/base/models/BaseModel';
import intern from 'intern';
import { restore } from 'sinon';

const { suite, test, afterEach } = intern.getPlugin('interface.tdd');
const { assert /*expect*/ } = intern.getPlugin('chai');

// class TestModel extends BaseModel {
//   constructor() {
//     super();
//   }
// }

suite(__filename.substring(__filename.indexOf('/server-test') + '/server-test/'.length), (): void => {
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

  test('should initialize the schema and add all defined properties', () => {
    // const model = new TestModel();
    // expect(model.schema).to.be.undefined;
    // model.initSchema();
    // expect(propertiesSpy.calledOnce);
    // expect(model.schema).to.not.be.undefined;
    // expect(model.schema instanceof mongoose.Schema).to.be.true;
    // // expect(model.schema.paths.test).to.not.be.undefined;
  });
});

suite('generating model', () => {
  test('should generate model', () => {
    // const model = new TestModel();
    // const mongooseModelSpy = spy(mongoose, 'model');
    // expect(model.schema).to.not.be.undefined;
    // expect(model.schema instanceof mongoose.Schema).to.be.true;
    // expect(mongooseModelSpy.calledOnceWithExactly('TestModel', model.schema)).to.be.true;
  });
});
