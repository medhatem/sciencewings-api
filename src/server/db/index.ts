import 'reflect-metadata';

import { MikroORM } from '@mikro-orm/core';
import { ServerDBConfig } from '../types/ServerConfiguration';

export let connection: MikroORM;

export async function startDB(config: ServerDBConfig) {
  connection = await MikroORM.init({
    type: 'postgresql',
    dbName: config.dbName,
    host: config.host,
    port: config.port,
    allowGlobalContext: true,
    user: config.dbUsername,
    password: config.dbPassword,
    entities: ['dist/server/modules/**/models/*'],
  });
  await connection.connect();
  // await connection.getSchemaGenerator().dropSchema();
  await connection.getSchemaGenerator().updateSchema();
  // await connection.close(true);
  return connection;
}
