import { Result } from '@utils/Result';
import { ResourceCalendar } from '..';
import { CreateResourceCalendarRO } from '../routes/RequestObject';

export abstract class IResourceCalendarService {
  createResourceCalendar: (payload: CreateResourceCalendarRO) => Promise<Result<ResourceCalendar>>;
}
