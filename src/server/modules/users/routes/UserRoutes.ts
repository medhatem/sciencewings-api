import { POST, Path, Security, ContextRequest, PUT, GET, PathParam, PreProcessor } from 'typescript-rest';
import { container, provideSingleton } from '@/di/index';
import { BaseRoutes } from '@/modules/base/routes/BaseRoutes';
import { Response } from 'typescript-rest-swagger';
import { User } from '@/modules/users/models/User';
import { UserRequest } from '@/types/UserRequest';
import { RegisterUserFromTokenDTO, ResetPasswordDTO } from '@/modules/users/dtos/RegisterUserFromTokenDTO';
import { changeUserLanguageDTO, UserGetDTO } from '@/modules/users/dtos/UserDTO';
import { ResetPasswordRO, UserRO } from './RequstObjects';
import { UpdateUserDTO } from '@/modules/users/dtos/UserUpdateDTO';
import { LoggerStorage } from '@/decorators/loggerStorage';
import { CreatedUserDTO } from '@/modules/users/dtos/CreatedUserDTO';
import { IUserService } from '@/modules/users/interfaces/IUserService';
import { validateKeyclockUser } from '@/authenticators/validateKeyclockUser';
import { InternalServerError, NotFoundError } from 'typescript-rest/dist/server/model/errors';

@provideSingleton()
@Path('users')
export class UserRoutes extends BaseRoutes<User> {
  constructor(private userService: IUserService) {
    super(userService as any, new UserGetDTO(), new UpdateUserDTO());
  }

  static getInstance(): UserRoutes {
    return container.get(UserRoutes);
  }

  /**
   * Registers a new user in the database
   * this route is called after signup
   * since keycloak takes care of creating the user
   * we parse the user data from the keycloak token
   * and save it to the database
   *
   * @param request
   */
  @POST
  @Path('registerUserFromToken')
  @Response<RegisterUserFromTokenDTO>(201, 'User Registred Successfully')
  @Response<InternalServerError>(500, 'Internal Server Error')
  @Response<NotFoundError>(404, 'Not Found Error')
  @LoggerStorage()
  @PreProcessor(validateKeyclockUser)
  public async registerUserFromToken(@ContextRequest request: UserRequest): Promise<RegisterUserFromTokenDTO> {
    const result = await this.userService.registerUser(request.keycloakUser);

    return new RegisterUserFromTokenDTO({
      body: {
        id: result,
        statusCode: 201,
      },
    });
  }

  /**
   *  Method that resets a user password in keycloak
   *
   * @param payload
   */
  @POST
  @Path('resetPassword')
  @Response<ResetPasswordDTO>(201, 'Password reset successfully')
  @Response<InternalServerError>(500, 'Internal Server Error')
  @Response<NotFoundError>(404, 'Not Found Error')
  @Security()
  @LoggerStorage()
  public async resetPassword(payload: ResetPasswordRO): Promise<ResetPasswordDTO> {
    const result = await this.userService.resetPassword(payload);

    return new ResetPasswordDTO({
      body: {
        massage: result,
        statusCode: 200,
      },
    });
  }

  /**
   * Create user
   * Must be authentificated
   * @param payload: User object
   */
  @POST
  @Path('create')
  @LoggerStorage()
  @Response<CreatedUserDTO>(201, 'User created Successfully')
  @Response<InternalServerError>(500, 'Internal Server Error')
  @Response<NotFoundError>(404, 'Not Found Error ')
  public async createUser(payload: UserRO): Promise<CreatedUserDTO> {
    const result = await this.userService.createUser(payload);

    return new CreatedUserDTO({
      body: {
        ...result,
        statusCode: 201,
      },
    });
  }

  /**
   * update user
   * Must be authentificated
   * @param payload: User object
   */
  @PUT
  @Path('updateUser/:keycloakId')
  @Security()
  @LoggerStorage()
  @Response<CreatedUserDTO>(204, 'User updated Successfully')
  @Response<InternalServerError>(500, 'Internal Server Error')
  @Response<NotFoundError>(404, 'Not Found Error')
  public async updateUser(payload: UserRO, @PathParam('keycloakId') keycloakId: string): Promise<CreatedUserDTO> {
    const result = await this.userService.updateUserByKeycloakId(payload, keycloakId);

    return new CreatedUserDTO({
      body: {
        ...result,
        statusCode: 204,
      },
    });
  }

  /**
   * Update user details
   * Must be authentificated
   * @param payload: User object
   */
  @PUT
  @Path('updateUserDetail')
  @Security()
  @LoggerStorage()
  @Response<CreatedUserDTO>(204, 'User updated Successfully')
  @Response<InternalServerError>(500, 'Internal Server Error')
  @Response<NotFoundError>(404, 'Not Found Error')
  public async updateUserDetails(payload: UserRO, @ContextRequest request: UserRequest): Promise<CreatedUserDTO> {
    const result = await this.userService.updateUserDetails(payload, request.userId);

    return new CreatedUserDTO({
      body: {
        userId: result,
        statusCode: 204,
      },
    });
  }

  /**
   * Get user By auth token
   */
  @GET
  @Path('getUserByKeycloakId')
  @LoggerStorage()
  @Security()
  @Response<UserGetDTO>(200, 'Return User Successfully')
  @Response<InternalServerError>(500, 'Internal Server Error')
  @Response<NotFoundError>(404, 'Not Found Error')
  public async getUserByKeycloakId(@ContextRequest request: UserRequest): Promise<UserGetDTO> {
    const result = await this.userService.getUserByKeycloakId(request.keycloakUser.sub);

    return new UserGetDTO({ body: { data: [...([result] || [])], statusCode: 200 } });
  }

  /**
   * update user languague
   * Must be authentificated
   * @param languague: User languague
   */
  @PUT
  @Path('/:languague')
  @Security()
  @LoggerStorage()
  @Response<CreatedUserDTO>(204, 'User languague updated Successfully')
  @Response<InternalServerError>(500, 'Internal Server Error')
  @Response<NotFoundError>(404, 'Not Found Error')
  public async changeUserLanguague(
    @PathParam('languague') languague: string,
    @ContextRequest request: UserRequest,
  ): Promise<changeUserLanguageDTO> {
    const result = await this.userService.changeUserLanguague(languague, request.userId);

    return new changeUserLanguageDTO({ body: { id: result, statusCode: 204 } });
  }
}
