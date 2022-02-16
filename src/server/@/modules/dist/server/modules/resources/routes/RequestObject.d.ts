export declare class CreateResourceCalendarRO {
    name: string;
    active?: boolean;
    organization?: number;
    hoursPerDay?: number;
    timezone: string;
    twoWeeksCalendar?: boolean;
}
export declare class CreateResourceRO {
    name: string;
    active?: boolean;
    organization?: number;
    resourceType: string;
    user?: number;
    timeEfficiency: number;
    timezone: string;
    calendar: CreateResourceCalendarRO;
}
