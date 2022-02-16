import { BaseModel } from '@/modules/base/models/BaseModel';
import { Organization } from './Organization';
export declare class ResConfigSettings extends BaseModel<ResConfigSettings> {
    constructor();
    static getInstance(): ResConfigSettings;
    id: number;
    organization: Organization;
    userDefaultRights?: boolean;
    externalEmailServerDefault?: boolean;
    moduleGoogleCalendar?: boolean;
    moduleMicrosoftCalendar?: boolean;
    moduleAccountInterorganizationRules?: boolean;
    moduleHrPresence?: boolean;
    moduleHrSkills?: boolean;
    hrPresenceControlLogin?: boolean;
    hrPresenceControlEmail?: boolean;
    hrPresenceControlIp?: boolean;
    moduleHrAttendance?: boolean;
    hrMemberSelfEdit?: boolean;
}
