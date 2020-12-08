import * as Config from './config.json';

import { Server } from './Server';
import { ServerConfiguration } from './types/ServerConfiguration';

// istanbul ignore next
if (process.argv[1].includes('dist/server/index.js')) {
  (async () => {
    const server = new Server(Config as ServerConfiguration);
    await server.startApp();
  })();
}
