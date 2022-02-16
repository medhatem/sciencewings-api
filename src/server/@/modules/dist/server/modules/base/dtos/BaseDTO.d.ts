export declare class BaseBodyDTO {
    statusCode: number;
}
export declare class BaseErrorDTO {
    statusCode: number;
    errorMessage: string;
}
export declare class BaseRequestDTO {
    serialize(payload: {
        [key: string]: any;
    }): this;
    deserialize<T extends BaseRequestDTO>(model: T, payload: any): any;
    body?: BaseBodyDTO;
    error?: BaseErrorDTO;
}
export declare class BaseDTO {
    id: number;
    createdAt: Date;
    updatedAt: Date;
}
