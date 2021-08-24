import { container, provideSingleton } from '../../di';
import { UserService } from '../../service/UserService';
import { Path, QueryParam, GET, POST, Security, ContextRequest } from 'typescript-rest';
import { Response } from 'typescript-rest-swagger';
import * as express from 'express';
import { CredentialsRO, UserRO, UserSignedInRO, UserSignedUpRO } from './RequestObject';

@provideSingleton()
@Path('/api/v1/user')
export class UserRoutes {
  constructor(private userService: UserService = UserService.getInstance()) {}

  static getInstance(): UserRoutes {
    return container.get(UserRoutes);
  }

  /**
   *
   * use the user data given in the request body to create a new user entry
   * return the newly created user or an error
   *
   */
  @Path('signup')
  @POST
  @Response<UserSignedUpRO>(200, 'successful signup')
  @Response<Error>(500, 'internal server srror')
  public async signup(body: UserRO): Promise<UserSignedUpRO> {
    return await this.userService.signup(body);
  }

  /**
   * use credentials found in body to login a user into the application
   * return a response with the logged in user as well as its jwt token
   * return an error response if the credentials are wrong
   *
   */
  @Path('signin')
  @POST
  @Response<UserSignedInRO>(200, 'successul signin')
  @Response<Error>(500, 'internal server error')
  public async signin(credentials: CredentialsRO): Promise<UserSignedInRO> {
    return await this.userService.signin(credentials);
  }

  @Path('newRoute')
  @GET
  @Response('success')
  @Response('error')
  @Security()
  public async newRoute(@QueryParam('body') body: string, @ContextRequest req: express.Request) {
    return body;
  }
}
