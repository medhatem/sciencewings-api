import 'module-alias/register';

import * as Config from './config.json';

import { Server } from './Server';
import { ServerConfiguration } from './types/ServerConfiguration';
import { container } from './di';

container.initialize();
// istanbul ignore next
if (process.argv[1].includes('dist/server/index.js')) {
  (async () => {
    const server = new Server((Config as any) as ServerConfiguration);
    await server.startApp();
  })();
}
