import { Class, buildMapper } from 'dto-mapper';

import { BaseRequestDTO } from '@modules/base/dtos/BaseDTO';

/**
 * serialize a payload into a given DTO
 *
 * @param DTO the DTO to map
 */
export function WrapRoute<T extends BaseRequestDTO>(
  DTO: Class<T>,
): (target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) => any {
  return (target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<any>): any => {
    const originalFunction: Function = descriptor.value;
    descriptor.value = async function (...args: any[]) {
      const mapper = buildMapper(DTO);
      try {
        const result = await originalFunction.apply(this, args);
        return mapper.serialize({ body: { ...result } });
      } catch (error) {
        return mapper.serialize({ error: { statusCode: 500, errorMessage: 'Internal Server Error' } });
      }
    };
    return descriptor;
  };
}
