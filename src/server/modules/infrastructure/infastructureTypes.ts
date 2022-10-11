import { Member } from '@/modules/hr/models/Member';
import { Infrastructure } from '@/modules/infrastructure/models/Infrastructure';

export type infrastructurelistline = {
  id: number;
  name: string;
  key: string;
  resourcesNb: number;
  responsible: Member;
  subInfrastructure: Array<Infrastructure>;
};

export type subInfrasListLine = {
  subInfrastructure: Infrastructure;
  resourcesNb: number;
};
