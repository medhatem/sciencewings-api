import { MikroORM } from '@mikro-orm/core';
import { ServerDBConfig } from '../types/ServerConfiguration';
import 'reflect-metadata';
export declare let connection: MikroORM;
export declare function startDB(config: ServerDBConfig): Promise<MikroORM<import("@mikro-orm/core").IDatabaseDriver<import("@mikro-orm/core").Connection>>>;
