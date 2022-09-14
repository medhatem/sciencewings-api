import { Project } from '@/modules/projects/models/Project';

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
  projectDao: Project;
};
