import { POST, Path, Security, ContextRequest, PUT } from 'typescript-rest';
import { container, provideSingleton } from '@di/index';
import { BaseRoutes } from '../../base/routes/BaseRoutes';
import { KEYCLOAK_TOKEN } from '../../../authenticators/constants';
import { Response } from 'typescript-rest-swagger';
import { User } from '../models/User';
import { UserService } from '../services/UserService';
import { UserRequest } from '../../../types/UserRequest';
import { RegisterUserFromTokenDTO, ResetPasswordDTO } from '../dtos/RegisterUserFromTokenDTO';
import { UserDTO } from '../dtos/UserDTO';
import { ResetPasswordRO, UserDetailsRO } from './RequstObjects';
import { UpdateUserDTO } from '../dtos/UserUpdateDTO';
import { Result } from '@utils/Result';
import { LoggerStorage } from '../../../decorators/loggerStorage';
import { CreatedUserDTO } from '../dtos/CreatedUserDTO';

@provideSingleton()
@Path('users')
export class UserRoutes extends BaseRoutes<User> {
  constructor(private userService: UserService) {
    super(userService, UserDTO, UpdateUserDTO);
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

  @PUT
  @Path('updateUserDetail')
  @Security([], KEYCLOAK_TOKEN)
  @LoggerStorage()
  public async updateUserDetails(
    payload: UserDetailsRO,
    @ContextRequest request: UserRequest,
  ): Promise<CreatedUserDTO> {
    const result = await this.userService.updateUserDetails(payload, request.userId);

    if (result.isFailure) {
      return new CreatedUserDTO().serialize({ error: { statusCode: 500, errorMessage: result.error } });
    }

    return new CreatedUserDTO().serialize({ body: { createdOrgId: result.getValue(), statusCode: 204 } });
  }
}
