/// <reference types="node" />
import { AsyncLocalStorage } from 'async_hooks';
/**
 * Class used mainly to create a storage
 * the storage will keep the state of the routes
 * it will contain a unique id which will be useful
 * for the logger when tracing back the logs
 */
export declare class LocalStorage extends AsyncLocalStorage<any> {
    static getInstance(): LocalStorage;
}
