import { JsonObject, JsonProperty } from 'typescript-json-serializer';

import { unique } from '@/decorators/unique';
import { Infrastructure } from '../models/Infrastructure';
import { Resource } from '@/modules/resources/models/Resource';
import { Organization } from '@/modules/organizations';
import { Member } from '@/modules/hr/models/Member';

@JsonObject()
@unique
export class InfrustructureRO {

  @JsonProperty()
  name!: string;

  @JsonProperty()
  description?: string;

  @JsonProperty()
  key!: number;

  @JsonProperty()
  public responsables? = Array<Member>;

  @JsonProperty()
  public parent?: Infrastructure;

  @JsonProperty()
  resources!: Array<Resource>;

  @JsonProperty()
  organization!: Organization;
}
@JsonObject()
@unique
export class UpdateinfrastructureRO {
   @JsonProperty()
  name?: string;

  @JsonProperty()
  description?: string;

  @JsonProperty()
  key?: number;

  @JsonProperty()
  public responsables? = Array<Member>;

  @JsonProperty()
  public parent?: Infrastructure;

  @JsonProperty()
  resources?: Array<Resource>;
  
  @JsonProperty()
  organization?: Organization;
}
