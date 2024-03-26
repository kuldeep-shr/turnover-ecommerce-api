"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const arrayToString = (data) => {
    // check if data is array or not
    if (data === undefined) {
        return "";
    }
    if (Array.isArray(data)) {
        if (data.length == 0)
            return "";
        else {
            return data
                .map(function (a) {
                return "'" + a.replace("'", "''") + "'";
            })
                .join();
        }
    }
    if (data != "") {
        return `'${data}'`;
    }
    return "";
};
exports.default = arrayToString;
//# sourceMappingURL=operation.js.map