import { Member } from '@/modules/hr/models/Member';
import { Contract } from '@/modules/hr/models/Contract';
import { Project } from '@/modules/projects/models/Project';
import { Group } from '@/modules/hr/models/Group';
import { Resource } from '@/modules/resources/models/Resource';
import { Infrastructure } from '@/modules/infrastructure/models/Infrastructure';
import { infrastructurelistline } from '@/modules/infrastructure/infastructureTypes';

export type EmailMessage = {
  to: string;
  from: string;
  subject: string;
  text: string;
  html: string;
};

export type Json = { [key: string]: any };

export type MemberKey = {
  userId: number;
  orgId: number;
};

export type OrgKey = {
  orgId: number;
  orgName: string;
};

export type ProjectList = {
  id: number;
  title: string;
  responsable: string;
  members: number;
  startDate: Date;
  projectDto: Project;
};

export type Pagination = {
  length?: number;
  size?: number;
  page?: number;
  lastPage?: number;
  startIndex?: number;
  endIndex?: number;
};

export type MembersList = {
  data: Member[];
  pagination?: Pagination;
};

export type ProjectsList = {
  data: Project[];
  pagination?: Pagination;
};

export type ResourcesList = {
  data: Resource[];
  pagination?: Pagination;
};

export type GroupsList = {
  data: Group[];
  pagination?: Pagination;
};

export type ContractsList = {
  data: Contract[];
  pagination?: Pagination;
};

export type InfrastructuresList = {
  data: Infrastructure[] | infrastructurelistline[];
  pagination?: Pagination;
};
