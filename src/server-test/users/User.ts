// import { User } from '@/modules/users/models/User';
// import intern from 'intern';
// import { restore } from 'sinon';

// const { suite, test, beforeEach, afterEach } = intern.getPlugin('interface.tdd');
// const { assert, expect } = intern.getPlugin('chai');

// suite(__filename.substring(__filename.indexOf('/server-test') + '/server-test/'.length), (): void => {
//   beforeEach((): void => {});
//   afterEach((): void => {
//     restore();
//   });
//   test('should create the right instance', () => {
//     const instance = User.getInstance();
//     expect(instance instanceof User);
//   });
//   test('should create a singleton instance', () => {
//     const instance = User.getInstance();
//     expect(instance instanceof User);
//     assert.deepEqual(new User(), instance);
//   });
// });
