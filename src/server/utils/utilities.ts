import { Collection } from '@mikro-orm/core';
import { SinonStubbedInstance } from 'sinon';

const wait = async (time: number) => {
  return await new Promise((resolve) => {
    setTimeout(resolve, time);
  });
};

/**
 * apply a callback method with certain behavior to every element of a given array
 * can be called seuentially with a regular for loop
 * or non sequentially with a map
 * @param list
 * @param callback
 * @param sequential
 * @param standoff
 * @returns
 */
export const applyToAll = async <T, G>(
  list: T[],
  callback: (element: T, index?: number) => Promise<G>,
  sequential = false,
  standoff = 300,
): Promise<G[]> => {
  if (sequential) {
    const output: G[] = [];
    let index = -1;
    for (const element of list) {
      output.push(await callback(element, ++index));
    }
    return output;
  } else {
    return Promise.all(
      list.map(async (element, index) => {
        if (standoff != 0) {
          await wait(standoff * index);
        }
        return callback(element, index);
      }),
    );
  }
};

/**
 * This is an override to the beforeDeserialization of the package  typescript-json-serializer
 * it checks if the property to deserialize in a collection
 * if so then it converts it as a json array
 * else keep it as is
 *
 *
 * We do this because Mikro-Orm uses collections which acts as an array but are different in type
 * so in order for typescript-json-serializer to be able to understand and deserialize the property
 * we need to convert it properly to array
 *
 *
 * @param prop the property to deserialize
 */
export const beforeDeserialize: (property: any, currentInstance?: any) => any = (prop: any) => {
  if (prop instanceof Collection) {
    const result = prop.toJSON();
    return result;
  }
  return prop;
};

/**
 * stub a method with args and results
 * @param className class to be stubed
 * @param methodToStub method to be stubed
 * @param args argument passed to the stub method
 * @param returnValue stub method result
 */

export const mockMethodWithResult = (
  className: SinonStubbedInstance<any>,
  methodToStub: any,
  args: any,
  returnValue: any,
) => {
  if (args.length === 0) {
    className[methodToStub].returns(returnValue);
  } else {
    className[methodToStub].withArgs(...args).returns(returnValue);
  }
};
