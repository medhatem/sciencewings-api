export type responsable = {
  name: string;
  workEmail: string;
};

export type subInfrastructure = {
  id: number;
  name: string;
};

export type infrastructurelistline = {
  id: number;
  name: string;
  resourcesNb: number;
  responsibles: Array<responsable>;
  subInfrastructure: Array<subInfrastructure>;
};
