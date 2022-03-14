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
      return new RegisterUserFromTokenDTO().deserialize({
        error: {
          statusCode: 500,
          errorMessage: result.error,
        },
      });
    }
    return new RegisterUserFromTokenDTO().deserialize({
      body: {
        id: result.getValue,
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
  @Response<ResetPasswordDTO>(500, 'Internal Server Error')
  @Security([], KEYCLOAK_TOKEN)
  @LoggerStorage()
  public async resetPassword(payload: ResetPasswordRO): Promise<ResetPasswordDTO> {
    const result = await this.userService.resetPassword(payload);

    if (result.isFailure) {
      return new ResetPasswordDTO().deserialize({
        error: {
          statusCode: 500,
          errorMessage: result.error,
        },
      });
    }

    return new ResetPasswordDTO().deserialize({
      body: {
        massage: result.getValue,
        statusCode: 200,
      },
    });
  }

  public setUserObjectForDeserialize(user: User) {
    return {
      ...user,
      addresses: user.address.toArray(),
      phone: user.phone.toArray(),
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
      return new CreatedUserDTO().deserialize({
        error: {
          statusCode: 500,
          errorMessage: result.error,
        },
      });
    }

    return new CreatedUserDTO().deserialize({
      body: {
        ...this.setUserObjectForDeserialize(result.getValue()),
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
  @Security([], KEYCLOAK_TOKEN)
  @LoggerStorage()
  @Response<CreatedUserDTO>(204, 'User updated Successfully')
  @Response<CreatedUserDTO>(500, 'Internal Server Error')
  public async updateUser(payload: UserRO, @PathParam('keycloakId') keycloakId: string): Promise<CreatedUserDTO> {
    const result = await this.userService.updateUserByKeycloakId(payload, keycloakId);

    if (result.isFailure) {
      return new CreatedUserDTO().deserialize({
        error: {
          statusCode: 500,
          errorMessage: result.error,
        },
      });
    }

    return new CreatedUserDTO().deserialize({
      body: {
        ...this.setUserObjectForDeserialize(result.getValue()),
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
  @Security([], KEYCLOAK_TOKEN)
  @LoggerStorage()
  @Response<CreatedUserDTO>(204, 'User updated Successfully')
  @Response<CreatedUserDTO>(500, 'Internal Server Error')
  public async updateUserDetails(payload: UserRO, @ContextRequest request: UserRequest): Promise<CreatedUserDTO> {
    const result = await this.userService.updateUserDetails(payload, request.userId);

    if (result.isFailure) {
      return new CreatedUserDTO().deserialize({
        error: {
          statusCode: 500,
          errorMessage: result.error,
        },
      });
    }

    return new CreatedUserDTO().deserialize({
      body: {
        userId: result.getValue(),
        statusCode: 204,
      },
    });
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
      return new UserDTO().deserialize({
        error: {
          statusCode: 404,
          errorMessage: result.error,
        },
      });
    }

    return new UserDTO().deserialize({
      body: {
        ...this.setUserObjectForDeserialize(result.getValue()),
        statusCode: 200,
      },
    });
  }
}
