import KcAdminClient from '@keycloak/keycloak-admin-client';
import { requiredAction } from '@keycloak/keycloak-admin-client';
export { KcAdminClient, requiredAction };
export declare class Keycloak {
    private kcAdminClient;
    constructor();
    static getInstance(): Keycloak;
    getAdminClient(): KcAdminClient;
    init(): Promise<void>;
}
