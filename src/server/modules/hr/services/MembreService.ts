import { container, provideSingleton } from '@di/index';

import { BaseService } from '@modules/base/services/BaseService';
import { Membre } from '@modules/hr/models/Membre';
import { MembreDao } from '../daos/MembreDao';

@provideSingleton()
export class MembreService extends BaseService<Membre> {
  constructor(public dao: MembreDao) {
    super(dao);
  }

  static getInstance(): MembreService {
    return container.get(MembreService);
  }
}
