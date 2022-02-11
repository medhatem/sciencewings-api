import { container, provideSingleton } from '@di/index';
import { MembreService as MembreService } from '../services/MembreService';
import { BaseRoutes } from '@modules/base/routes/BaseRoutes';
import { Membre } from '../models/Membre';
import { Path, GET, QueryParam } from 'typescript-rest';
import { MembreDTO } from '../dtos/MembreDTO';
import { UpdateMembreDTO } from '../dtos/UpdateMembreDTO';

@provideSingleton()
@Path('membre')
export class MembreRoutes extends BaseRoutes<Membre> {
  constructor(private EmployeeRoutes: MembreService) {
    super(EmployeeRoutes, MembreDTO, UpdateMembreDTO);
    console.log(this.EmployeeRoutes);
  }

  static getInstance(): MembreRoutes {
    return container.get(MembreRoutes);
  }

  @GET
  @Path('newRoute')
  public async newRoute(@QueryParam('body') body: string) {
    return body;
  }
}
