import 'reflect-metadata';

import { MikroORM } from '@mikro-orm/core/MikroORM';
import { ServerDBConfig } from '../types/ServerConfiguration';
import { join } from 'path';

export let connection: MikroORM;

export async function startDB(config: ServerDBConfig) {
  connection = await MikroORM.init({
    type: 'postgresql',
    dbName: config.dbName,
    host: config.host,
    port: config.port,
    user: config.dbUsername,
    password: config.dbPassword,
    entities: [join(__dirname, '../models/')],
  });
  // await connection.connect();
  await connection.getSchemaGenerator().updateSchema();
  return connection;
}
