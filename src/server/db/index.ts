import 'reflect-metadata';

import { MikroORM } from '@mikro-orm/core/MikroORM';
import { ServerDBConfig } from '../types/ServerConfiguration';

export let connection: MikroORM;

export async function startDB(config: ServerDBConfig) {
  connection = await MikroORM.init({
    type: 'postgresql',
    dbName: config.dbName,
    host: config.host,
    port: config.port,
    user: config.dbUsername,
    password: config.dbPassword,
    entities: ['dist/server/modules/**/models/*'],
  });

  await connection.connect();
  await connection.getSchemaGenerator().updateSchema();

  // const generator = connection.getSchemaGenerator();

  // const dropDump = await generator.getDropSchemaSQL();
  // console.log(dropDump);

  // const createDump = await generator.getCreateSchemaSQL();
  // console.log(createDump);

  // const updateDump = await generator.getUpdateSchemaSQL();
  // console.log(updateDump);

  // // there is also `generate()` method that returns drop + create queries
  // const dropAndCreateDump = await generator.generate();
  // console.log(dropAndCreateDump);

  // // or you can run those queries directly, but be sure to check them first!
  // await generator.dropSchema();
  // await generator.createSchema();
  // await generator.updateSchema();

  // await connection.close(true);
  return connection;
}
