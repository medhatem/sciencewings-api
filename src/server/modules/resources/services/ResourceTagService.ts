import { provideSingleton } from '@/di';
import { BaseService } from '@/modules/base';
import { IResourceTagService } from '@/modules/resources/interfaces/IResourceTagService';
import { ResourceTag } from '@/modules/resources/models/ResourceTag';

@provideSingleton(IResourceTagService)
export class ResourceTagService extends BaseService<ResourceTag> {}
