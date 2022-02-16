export declare class Unauthorized extends Error {
    message: string;
    status: number;
    constructor(message?: string, status?: number);
}
