import { IBaseService } from '@/modules/base/interfaces/IBaseService';
import { Result } from '@/utils/Result';

export abstract class IResourceService extends IBaseService<any> {
  getResourcesSettingsGeneralStatus: (resourceId: number) => Promise<Result<any>>;
  getResourceSettingsGeneralVisbility: (resourceId: number) => Promise<Result<any>>;
  getResourceSettingsGeneralProperties: (resourceId: number) => Promise<Result<any>>;
}
