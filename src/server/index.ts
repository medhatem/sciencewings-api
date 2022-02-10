import 'module-alias/register';

import { Configuration } from './configuration/Configuration';
import { Server } from './Server';
import { container } from './di';

export * from '@modules/users';
export * from '@modules/base';
export * from '@modules/hr';
export * from '@modules/organizations/routes/OrganizationRoutes';
export * from '@modules/resources';

container.initialize();

// istanbul ignore next
if (process.argv[1].includes('dist/server/index.js')) {
  (async () => {
    const server = new Server(container.get(Configuration));
    await server.startApp();
  })();
}
