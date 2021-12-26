import { container, provideSingleton } from '@di/index';
import { UserService } from '../services/UserService';
import { CredentialsRO, UserGetRO, UserRO, UserSignedInRO, UserSignedUpRO, UserUpdateRO } from './RequestObject';
import { BaseRoutes } from '../../base/routes/BaseRoutes';
import { User } from '../models/User';
import { Path, POST, GET, QueryParam } from 'typescript-rest';
import { Response } from 'typescript-rest-swagger';

@provideSingleton()
@Path('user')
export class UserRoutes extends BaseRoutes<User> {
  constructor(private userService: UserService) {
    super(userService, UserGetRO, UserUpdateRO);
  }

  static getInstance(): UserRoutes {
    return container.get(UserRoutes);
  }

  /**
   *
   * use the user data given in the request body to create a new user entry
   * return the newly created user or an error
   *
   */
  @POST
  @Path('/signup')
  @Response(201, 'successful signup')
  @Response(500, 'internal server error')
  public async signup(body: UserRO): Promise<UserSignedUpRO> {
    return await this.userService.signup(body);
  }

  /**
   * use credentials found in body to login a user into the application
   * return a response with the logged in user as well as its jwt token
   * return an error response if the credentials are wrong
   *
   */
  @POST
  @Path('signin')
  @Response(200, 'successful signin')
  @Response<Error>(500, 'internal server error')
  public async signin(credentials: CredentialsRO): Promise<UserSignedInRO> {
    return await this.userService.signin(credentials);
  }

  @GET
  @Path('newRoute')
  public async newRoute(@QueryParam('body') body: string) {
    return body;
  }
}
