import { container, provideSingleton } from '@di/index';
import { UserService } from '../../service/UserService';
import * as express from 'express';
import { CredentialsRO, UserGetRO, UserRO, UserSignedInRO, UserSignedUpRO, UserUpdateRO } from './RequestObject';
import { BaseRoutes } from '../BaseRoutes/BaseRoutes';
import { User } from '@models/User';
import { Get, SuccessResponse, Response, Route, Post, Body, Query, Request } from 'tsoa';

@provideSingleton()
@Route('user')
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
  @Post('signup')
  @SuccessResponse(201, 'successful signup')
  @Response(500, 'internal server error')
  public async signup(@Body() body: UserRO): Promise<UserSignedUpRO> {
    return await this.userService.signup(body);
  }

  /**
   * use credentials found in body to login a user into the application
   * return a response with the logged in user as well as its jwt token
   * return an error response if the credentials are wrong
   *
   */
  @Post('signin')
  @SuccessResponse(200, 'successful signin')
  @Response<Error>(500, 'internal server error')
  public async signin(@Body() credentials: CredentialsRO): Promise<UserSignedInRO> {
    return await this.userService.signin(credentials);
  }

  @Get('newRoute')
  public async newRoute(@Query('body') body: string, @Request() req: express.Request) {
    return body;
  }
}
