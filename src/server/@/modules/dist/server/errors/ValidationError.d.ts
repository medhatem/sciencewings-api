export declare class ValidatonError extends Error {
    status: number;
    constructor(message: string, status?: number);
}
