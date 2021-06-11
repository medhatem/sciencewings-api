import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

import { container, provideSingleton } from '../di';

import { BaseDao } from './BaseDao';
import { IUser } from '../interface';
import { ServerError } from '../errors/ServerError';
import { User } from '../model/User';

export const JWT_SECRET_KEY = 'jwt_secret_2121';
export type Credentials = { email: string; password: string };

@provideSingleton()
export class UserDao extends BaseDao<IUser> {
  private constructor(public model: User) {
    super(model);
  }

  static getInstance(): UserDao {
    return container.get(UserDao);
  }

  /**
   * creates a new user in database
   * make sure that the email of user to create does not already exist
   * if not then create the user with a hashed password and generate
   * the jwt token
   *
   *
   * @param user represents the user to create
   */
  public async signup(user: IUser): Promise<{ [key: string]: any }> {
    // check that a user with the given email does not exist
    const existingUser = await this.model.modelClass.findOne({ email: user.email }).exec();
    if (existingUser) {
      throw new ServerError(`user with email ${user.email} already exists`);
    }

    const encryptedPaaword = await bcrypt.hash(user.password, 10);
    user.password = encryptedPaaword;
    const token = jwt.sign(
      {
        email: user.email,
      },
      JWT_SECRET_KEY,
    );
    const createdUser: IUser = await this.create(user);

    return {
      token,
      id: createdUser._id,
    };
  }

  /**
   *
   * login a user with a given email and password
   * throw an error if the user does not exist
   *
   * @param param0 the user credentials that corresponds to the email and password
   */
  public async signin({ email, password }: Credentials): Promise<{ token: string; user: IUser }> {
    // get the user by email
    const user = (await this.model.modelClass.findOne({ email }).exec()) as IUser;

    if (user) {
      // compare password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        throw new ServerError('Wrong credentials');
      }
      // generate the token
      const token = jwt.sign(
        {
          email: user.email,
        },
        JWT_SECRET_KEY,
      );
      return {
        token,
        user,
      };
    } else {
      throw new ServerError(`User does not exist make sure that the credentials are correct`);
    }
  }
}
