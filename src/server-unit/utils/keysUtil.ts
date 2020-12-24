import { IBase } from '../../server/interface';
import { KeysEnum } from './types';

const { expect } = intern.getPlugin('chai');

export function validateMongooseSchemaKeys<T extends IBase>(
  schemaPaths: string[],
  enumKeys: KeysEnum<T>,
  counter: number = 0,
  acc?: string,
) {
  Object.keys(enumKeys).forEach((key) => {
    if (enumKeys[key as keyof typeof enumKeys] === true) {
      expect(schemaPaths.includes(!!acc ? `${acc}.${key}` : key)).to.be.true;
      counter++;
    } else {
      validateMongooseSchemaKeys(
        schemaPaths,
        enumKeys[key as keyof typeof enumKeys] as KeysEnum<T>,
        counter++,
        !!acc ? `${acc}.${key}` : `${key}`,
      );
    }
  });
  expect(counter).to.equal(schemaPaths.length);
}
