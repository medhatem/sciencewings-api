export class UserRO {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  address: {
    appt: number;
    city: string;
    street: string;
    zip: string;
  };
}
export class CredentialsRO {
  email: string;
  password: string;
}

export class UserSignedInRO {
  token: string;
  user: UserRO;
}

export class UserSignedUpRO {
  id: string;
  token: string;
}
