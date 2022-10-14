import { Member } from '@/modules/hr/models/Member';
import { Project } from '@/modules/projects/models/Project';
import { Group } from '..';

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
  members?: Member[];
  pagination: Pagination;
};

export type GroupsList = {
  groups?: Group[];
  pagination: Pagination;
};
