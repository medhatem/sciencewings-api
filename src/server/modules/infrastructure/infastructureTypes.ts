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
