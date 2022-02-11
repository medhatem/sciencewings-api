import { container, provideSingleton } from '@di/index';

import { BaseDao } from '@modules/base/daos/BaseDao';
import { Membre } from '@modules/hr/models/Membre';

@provideSingleton()
export class MembreDao extends BaseDao<Membre> {
  private constructor(public model: Membre) {
    super(model);
  }

  static getInstance(): MembreDao {
    return container.get(MembreDao);
  }
}
