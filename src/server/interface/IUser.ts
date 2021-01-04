import { IBase } from './IBase';

export interface IUser extends IBase {
  firstName: String;
  lastName: String;
  username: String;
  email: String;
  password: String;
  address: {
    appt: Number;
    zip: String;
    city: String;
    street: String;
  };
}
