import 'module-alias/register';

import { Configuration } from './configuration/Configuration';
import { Server } from './Server';
import { container } from './di';

container.initialize();
// istanbul ignore next
if (process.argv[1].includes('dist/server/index.js')) {
  (async () => {
    const server = new Server(container.get(Configuration));
    await server.startApp();
  })();
}
