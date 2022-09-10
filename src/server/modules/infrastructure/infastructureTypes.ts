import { Member } from '@/modules/hr/models/Member';
import { Infrastructure } from '@/modules/infrastructure/models/Infrastructure';

export type infrastructurelistline = {
  id: number;
  name: string;
  resourcesNb: number;
  responsibles: Array<Member>;
  subInfrastructure: Array<Infrastructure>;
};
