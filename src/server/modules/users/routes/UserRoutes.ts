import { POST, Path, Security, ContextRequest, PUT, GET, PathParam } from 'typescript-rest';
import { container, provideSingleton } from '@/di/index';
import { BaseRoutes } from '@/modules/base/routes/BaseRoutes';
import { KEYCLOAK_TOKEN } from '@/authenticators/constants';
import { Response } from 'typescript-rest-swagger';
import { User } from '@/modules/users/models/User';
import { UserRequest } from '@/types/UserRequest';
import { RegisterUserFromTokenDTO, ResetPasswordDTO } from '@/modules/users/dtos/RegisterUserFromTokenDTO';
import { UserDTO } from '@/modules/users/dtos/UserDTO';
import { ResetPasswordRO, UserRO } from './RequstObjects';
import { UpdateUserDTO } from '@/modules/users/dtos/UserUpdateDTO';
import { Result } from '@/utils/Result';
import { LoggerStorage } from '@/decorators/loggerStorage';
import { CreatedUserDTO } from '@/modules/users/dtos/CreatedUserDTO';
import { IUserService } from '@/modules/users/interfaces/IUserService';
import { deserialize } from 'typescript-json-serializer';

@provideSingleton()
@Path('users')
export class UserRoutes extends BaseRoutes<User> {
  constructor(private userService: IUserService) {
    super(userService as any, new UserDTO(), new UpdateUserDTO());
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
  @Response<ResetPasswordDTO>(500, 'Internal Server Error')
  @Security([], KEYCLOAK_TOKEN)
  @LoggerStorage()
  public async registerUserFromToken(@ContextRequest request: UserRequest): Promise<RegisterUserFromTokenDTO> {
    const result: Result<number> = await this.userService.registerUser(request.keycloakUser);

    if (result.isFailure) {
      return new RegisterUserFromTokenDTO().serialize({
        error: { statusCode: 500, errorMessage: result.error },
      });
    }

    return new RegisterUserFromTokenDTO().serialize({
      body: { statusCode: 201, userId: result.getValue() },
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
  @Response<ResetPasswordDTO>(500, 'Internal Server Error')
  @Security([], KEYCLOAK_TOKEN)
  @LoggerStorage()
  public async resetPassword(payload: ResetPasswordRO): Promise<ResetPasswordDTO> {
    const result = await this.userService.resetPassword(payload);

    if (result.isFailure) {
      return new ResetPasswordDTO().serialize({
        error: { statusCode: 500, errorMessage: result.error },
      });
    }

    return new ResetPasswordDTO().serialize({
      body: { statusCode: 200, message: result.getValue() },
    });
  }

  /**
   * Create user
   * Must be authentificated
   * @param payload: User object
   */
  @POST
  @Path('createUser')
  @Security([], KEYCLOAK_TOKEN)
  @LoggerStorage()
  @Response<CreatedUserDTO>(204, 'User updated Successfully')
  @Response<CreatedUserDTO>(500, 'Internal Server Error')
  public async createUser(payload: UserRO): Promise<CreatedUserDTO> {
    const result = await this.userService.createUser(payload);

    if (result.isFailure) {
      return new CreatedUserDTO().serialize({ error: { statusCode: 500, errorMessage: result.error } });
    }

    const user = result.getValue();
    user.phone = user.phone.toArray() as any;
    user.address = user.address.toArray() as any;
    console.log({ user });

    return deserialize({ body: { ...user, statusCode: 204 } }, CreatedUserDTO);
  }

  /**
   * update user
   * Must be authentificated
   * @param payload: User object
   */
  @PUT
  @Path('updateUser/:keycloakId')
  @Security([], KEYCLOAK_TOKEN)
  @LoggerStorage()
  @Response<CreatedUserDTO>(204, 'User updated Successfully')
  @Response<CreatedUserDTO>(500, 'Internal Server Error')
  public async updateUser(payload: UserRO, @PathParam('keycloakId') keycloakId: string): Promise<CreatedUserDTO> {
    const result = await this.userService.updateUser(payload, keycloakId);

    if (result.isFailure) {
      return new CreatedUserDTO().serialize({ error: { statusCode: 500, errorMessage: result.error } });
    }

    return new CreatedUserDTO().serialize({ body: { user: result.getValue(), statusCode: 201 } });
  }

  /**
   * Update user details
   * Must be authentificated
   * @param payload: User object
   */
  @PUT
  @Path('updateUserDetail')
  @Security([], KEYCLOAK_TOKEN)
  @LoggerStorage()
  @Response<CreatedUserDTO>(204, 'User updated Successfully')
  @Response<CreatedUserDTO>(500, 'Internal Server Error')
  public async updateUserDetails(payload: UserRO, @ContextRequest request: UserRequest): Promise<CreatedUserDTO> {
    const result = await this.userService.updateUserDetails(payload, request.userId);

    if (result.isFailure) {
      return new CreatedUserDTO().serialize({ error: { statusCode: 500, errorMessage: result.error } });
    }

    return new CreatedUserDTO().serialize({ body: { user: result.getValue(), statusCode: 204 } });
  }

  /**
   * Get user By auth token
   */
  @GET
  @Path('getUserByKeycloakId/:kcid')
  @LoggerStorage()
  @Response<UserDTO>(200, 'Return User Successfully')
  @Response<UserDTO>(500, 'Internal Server Error')
  public async getUserByKeycloakId(@PathParam('kcid') keycloakId: string): Promise<UserDTO> {
    const result = await this.userService.getUserByKeycloakId(keycloakId);

    if (result.isFailure) {
      return new UserDTO().serialize({ error: { statusCode: 404, errorMessage: result.error } });
    }
    const user = result.getValue();
    return new UserDTO().serialize({ body: { user, statusCode: 200 } });
  }
}
