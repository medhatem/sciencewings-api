import { BaseRO } from '../BaseRoutes/RequestObject';

export class UserGetRO extends BaseRO {
  _id: string;
  lastName: string;
  firstName: string;
  email: string;
}

export class UserUpdateRO extends BaseRO {
  _id: string;
  lastName: string;
  firstName: string;
  email: string;
}

export class UserRO extends BaseRO {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  // address: {
  //   appt: number;
  //   city: string;
  //   street: string;
  //   zip: string;
  // };
}
export class CredentialsRO extends BaseRO {
  email: string;
  password: string;
}

export class UserSignedInRO extends BaseRO {
  constructor(data?: any) {
    super();
    this.serialize(data);
  }
  token: string;
  user: UserRO;
}

export class UserSignedUpRO extends BaseRO {
  constructor(data?: any) {
    super();
    this.serialize(data);
  }
  id: number;
  token: string;
}
