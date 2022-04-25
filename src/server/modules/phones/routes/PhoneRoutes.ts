import { container, provideSingleton } from '@/di/index';
import { IPhoneService } from '@/modules/phones/interfaces/IPhoneService';
import { BaseRoutes } from '@/modules/base/routes/BaseRoutes';
import { Path } from 'typescript-rest';
import { PhoneDTO } from '../dtos';
import { Phone } from '../models/Phone';

@provideSingleton()
@Path('phone')
export class PhoneRoutes extends BaseRoutes<Phone> {
  constructor(PhoneService: IPhoneService) {
    super(PhoneService as any, new PhoneDTO(), new PhoneDTO());
  }

  static getInstance(): PhoneRoutes {
    return container.get(PhoneRoutes);
  }
}
