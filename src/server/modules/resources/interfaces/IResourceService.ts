import { IBaseService } from '@/modules/base/interfaces/IBaseService';
import {
  ResourceSettingsGeneralPropertiesRO,
  ResourceSettingsGeneralStatusRO,
  ResourceSettingsGeneralVisibilityRO,
} from '@/modules/resources/routes/RequestObject';
import { Result } from '@/utils/Result';

export abstract class IResourceService extends IBaseService<any> {
  updateResourcesSettingsGeneralStatus: (
    payload: ResourceSettingsGeneralStatusRO,
    resourceId: number,
  ) => Promise<Result<number>>;
  updateResourcesSettingsGeneralVisibility: (
    payload: ResourceSettingsGeneralVisibilityRO,
    resourceId: number,
  ) => Promise<Result<number>>;
  updateResourcesSettingsnGeneralProperties: (
    payload: ResourceSettingsGeneralPropertiesRO,
    resourceId: number,
  ) => Promise<Result<number>>;

  getResourceSettings: (resourceId: number) => Promise<Result<any>>;
}
