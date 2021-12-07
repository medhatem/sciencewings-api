import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

import { CredentialsRO, UserRO } from '@routes/UserRoutes/RequestObject';
import { container, provideSingleton } from '@di/index';

import { BaseDao } from './BaseDao';
import { ServerError } from '@errors/ServerError';
import { User } from '@models/User';

@provideSingleton()
export class UserDao extends BaseDao<User> {
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
  public async signup(user: UserRO): Promise<{ token: string; id: string }> {
    // check that a user with the given email does not exist
    const existingUser = await this.modelRepo.findOne({ where: { email: user.email } });

    if (existingUser) {
      throw new ServerError(`user with email ${user.email} already exists`);
    }

    const encryptedPaaword = await bcrypt.hash(user.password, 10);
    user.password = encryptedPaaword;
    const token = jwt.sign(
      {
        email: user.email,
      },
      process.env.TOKEN_SECRET,
    );
    const createdUser = await this.create(user as any);

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
  public async signin({ email, password }: CredentialsRO): Promise<{ token: string; user: User }> {
    // get the user by email
    const user = await this.modelRepo.findOne({ where: { email } });

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
        process.env.TOKEN_SECRET,
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
