import { IBase } from './IBase';

export interface IUser extends IBase {
  firstname: String;
  lastName: String;
  username: String;
  password: String;
  address: {
    appt: Number;
    zip: String;
    city: String;
    street: String;
  };
}
