import { BarberGetRO, BarberUpdateRO } from './RequestObject';
import { POST, Path } from 'typescript-rest';
import { UserRO, UserSignedUpRO } from '../../routes/UserRoutes/RequestObject';
import { container, provideSingleton } from '@di/index';

import { Barber } from '@models/Barber';
import { BarberService } from '../../service/BarberService';
import { BaseRoutes } from '../../routes/BaseRoutes/BaseRoutes';
import { Response } from 'typescript-rest-swagger';

@provideSingleton()
@Path('/api/v1/barber')
export class BarberRoutes extends BaseRoutes<Barber> {
  constructor(private barberService: BarberService) {
    super(barberService, BarberGetRO, BarberUpdateRO);
  }

  static getInstance(): BarberRoutes {
    return container.get(BarberRoutes);
  }

  /**
   *
   * use the user data given in the request body to create a new user entry
   * return the newly created user or an error
   *
   */
  @Path('signup')
  @POST
  @Response<UserSignedUpRO>(201, 'successful signup')
  @Response<Error>(500, 'internal server srror')
  public async signup(body: UserRO): Promise<UserSignedUpRO> {
    return await this.barberService.signup(body);
  }
}
