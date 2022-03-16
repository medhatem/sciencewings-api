import { JsonProperty, Serializable, deserialize, serialize } from 'typescript-json-serializer';

import { Collection } from '@mikro-orm/core';
import { unique } from '@/decorators/unique';

/**
 * loop through all the keys of a given object and contvert all
 * properties and sub properties that are collections to regular arrays
 *
 * This function is called pre-deserialization since MikroOrm collections are not
 * deserialized properly we then have to convert them into arrays
 *
 *
 * @param payload any object
 */
function convertAllCollectionsToArray(payload: { [key: string]: any }) {
  if (!payload) {
    return;
  }
  Object.keys(payload).forEach((key) => {
    if (payload[key] instanceof Collection) {
      payload[key] = payload[key].toJSON();
    } else if (Array.isArray(payload[key])) {
      if (typeof payload[key][0] === 'object') {
        payload[key].map((k: { [key: string]: any }) => convertAllCollectionsToArray(k));
      }
    } else if (typeof payload[key] === 'object') {
      convertAllCollectionsToArray(payload[key]);
    }
  });
}

@Serializable()
@unique
export class BaseBodyDTO {
  @JsonProperty()
  statusCode: number;
}

@Serializable()
@unique
export class BaseErrorDTO {
  @JsonProperty()
  statusCode: number;

  @JsonProperty()
  errorMessage: string;
}

@Serializable()
@unique
export class BaseRequestDTO {
  constructor(payload?: { [key: string]: any }) {
    if (payload && Object.keys(payload)?.length > 0) {
      //convert all collections to arrays before deserializing
      convertAllCollectionsToArray(payload);
      const result = this.deserialize(payload);
      Object.assign(this, result);
    }
  }

  serialize(payload: { [key: string]: any }): this {
    return serialize(payload as any);
  }

  deserialize(payload: { [key: string]: any }): this {
    return deserialize<this>(payload as any, this.constructor as any);
  }

  @JsonProperty()
  public body?: BaseBodyDTO;

  @JsonProperty()
  public error?: BaseErrorDTO;
}

@Serializable()
@unique
export class BaseDTO {
  @JsonProperty()
  id: number;
  @JsonProperty()
  createdAt: Date;
  @JsonProperty()
  updatedAt: Date;
}
