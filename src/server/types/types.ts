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
  title: string;
  responsable: string;
  members: number;
  startDate: Date;
};

export type responsableT = {
  name: string;
  workEmail: string;
};

export type subInfrastructureT = {
  id: number;
  name: string;
};

export type infrastructurelistline = {
  id: number;
  name: string;
  resourcesNb: number;
  responsibles: Array<responsableT>;
  subInfrastructure: Array<subInfrastructureT>;
};
