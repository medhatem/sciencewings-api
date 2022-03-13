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
      return deserialize(
        {
          error: {
            statusCode: 500,
            errorMessage: result.error,
          },
        },
        RegisterUserFromTokenDTO,
      );
    }

    const userId = result.getValue();

    return deserialize(
      {
        body: {
          userId,
          statusCode: 201,
        },
      },
      RegisterUserFromTokenDTO,
    );
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
      return deserialize(
        {
          error: {
            statusCode: 500,
            errorMessage: result.error,
          },
        },
        ResetPasswordDTO,
      );
    }

    const message = result.getValue();

    return deserialize(
      {
        body: {
          message,
          statusCode: 200,
        },
      },
      ResetPasswordDTO,
    );
  }

  public setUserObjectForDeserialize(user: User) {
    return {
      ...user,
      phone: user.phone.toArray(),
      address: user.address.toArray(),
    };
  }

  /**
   * Create user
   * Must be authentificated
   * @param payload: User object
   */
  @POST
  @Path('create')
  @Security([], KEYCLOAK_TOKEN)
  @LoggerStorage()
  @Response<CreatedUserDTO>(201, 'User created Successfully')
  @Response<CreatedUserDTO>(500, 'Internal Server Error')
  public async createUser(payload: UserRO): Promise<CreatedUserDTO> {
    const result = await this.userService.createUser(payload);

    if (result.isFailure) {
      return deserialize(
        {
          error: {
            statusCode: 500,
            errorMessage: result.error,
          },
        },
        CreatedUserDTO,
      );
    }

    const user: User = result.getValue();

    return deserialize(
      {
        body: {
          ...this.setUserObjectForDeserialize(user),
          statusCode: 201,
        },
      },
      CreatedUserDTO,
    );
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
    const result = await this.userService.updateUserByKeycloakId(payload, keycloakId);

    if (result.isFailure) {
      return deserialize(
        {
          error: {
            statusCode: 500,
            errorMessage: result.error,
          },
        },
        CreatedUserDTO,
      );
    }

    const user: User = result.getValue();

    return deserialize(
      {
        body: {
          ...this.setUserObjectForDeserialize(user),
          statusCode: 204,
        },
      },
      CreatedUserDTO,
    );
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
      return deserialize(
        {
          error: {
            statusCode: 500,
            errorMessage: result.error,
          },
        },
        CreatedUserDTO,
      );
    }

    const user = result.getValue();
    return deserialize(
      {
        body: {
          user,
          statusCode: 204,
        },
      },
      CreatedUserDTO,
    );
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
      return deserialize(
        {
          error: {
            statusCode: 404,
            errorMessage: result.error,
          },
        },
        UserDTO,
      );
    }
    const user: User = result.getValue();
    return deserialize(
      {
        body: {
          ...this.setUserObjectForDeserialize(user),
          statusCode: 200,
        },
      },
      UserDTO,
    );
  }
}
