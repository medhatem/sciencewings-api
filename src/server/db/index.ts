import { Column, Sequelize } from 'sequelize-typescript';
import { Model, Table } from 'sequelize-typescript';

import { ServerDBConfig } from '../types/ServerConfiguration';
import { join } from 'path';

export let database: Sequelize;

@Table
class Test extends Model<Test> {
  @Column
  name: string;
}

export function startDB(config: ServerDBConfig) {
  console.log('tatatat', join(__dirname, '..', '/models'));

  database = new Sequelize({
    database: config.dbName,
    username: config.dbUsername,
    password: config.dbPassword,
    dialect: 'postgres',
    repositoryMode: true,
    models: [`${join(__dirname, '..', '/models')}`],
  });
  database.addModels([Test]);
  Test.findAll();
}
