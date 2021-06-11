import { RouteEntity } from './RouteTypes';
import { UserRoutes } from './UserRoutes';
export const appRoutes: RouteEntity[] = [
  {
    name: 'User',
    router: UserRoutes.getInstance().getRouter(),
  },
];
