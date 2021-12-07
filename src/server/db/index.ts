import 'reflect-metadata';

import { Connection, createConnection } from 'typeorm';

import { ServerDBConfig } from '../types/ServerConfiguration';
import { join } from 'path';

export let connection: Connection;

export async function startDB(config: ServerDBConfig) {
  connection = await createConnection({
    type: 'postgres',
    host: config.host,
    port: config.port,
    username: config.dbUsername,
    password: config.dbPassword,
    database: config.dbName,
    entities: [`${join(__dirname, '..', '/models/*.js')}`],
    synchronize: true,
    logging: process.env.ENV === 'development',
  });

  return connection;
}
