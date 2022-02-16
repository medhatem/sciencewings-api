"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Result = void 0;
const Logger_1 = require("./Logger");
class Result {
    constructor(isSuccess, error, value) {
        if (isSuccess && error) {
            throw new Error(`InvalidOperation: A result cannot be 
          successful and contain an error`);
        }
        if (!isSuccess && !error) {
            throw new Error(`InvalidOperation: A failing result 
          needs to contain an error message`);
        }
        if (!isSuccess && error) {
            //log the error
            Logger_1.Logger.getInstance().error(error);
        }
        this.isSuccess = isSuccess;
        this.isFailure = !isSuccess;
        this.error = error;
        this._value = value;
        Object.freeze(this);
    }
    getValue() {
        if (!this.isSuccess) {
            throw new Error(`Cant retrieve the value from a failed result.`);
        }
        return this._value;
    }
    static ok(value) {
        return new Result(true, null, value);
    }
    static fail(error) {
        return new Result(false, error, null);
    }
    static combine(results) {
        for (const result of results) {
            if (result.isFailure)
                return result;
        }
        return Result.ok();
    }
}
exports.Result = Result;
//# sourceMappingURL=Result.js.map