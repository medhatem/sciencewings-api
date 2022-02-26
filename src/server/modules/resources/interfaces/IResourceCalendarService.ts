import { CreateResourceCalendarRO } from '@/modules/resources/routes/RequestObject';
import { IBaseService } from '@/modules/base/interfaces/IBaseService';
import { ResourceCalendar } from '@/modules/resources/models';
import { Result } from '@/utils/Result';

export abstract class IResourceCalendarService extends IBaseService<any> {
  createResourceCalendar: (payload: CreateResourceCalendarRO) => Promise<Result<ResourceCalendar>>;
}
