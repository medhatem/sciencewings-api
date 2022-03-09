import { BaseRoutes } from '@/modules/base/routes/BaseRoutes';
import { Member } from '@/modules/hr/models/Member';
import { Path } from 'typescript-rest';
import { provideSingleton } from '@/di/index';

@provideSingleton()
@Path('members')
export class MemberRoutes extends BaseRoutes<Member> {}
