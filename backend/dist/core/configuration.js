"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.configuration = void 0;
const getStringValue = (envName, defaultValue) => {
    if (process.env[envName] == null || process.env[envName].trim() === '') {
        console.log(`configuration#getStringValue()  : Env [${envName}] is empty. Use default value [${defaultValue}]`);
        return defaultValue;
    }
    const stringValue = process.env[envName];
    console.log(`configuration#getStringValue()  : Env [${envName}] = [${stringValue}]`);
    return stringValue;
};
const getNumberValue = (envName, defaultValue) => {
    if (process.env[envName] == null || process.env[envName].trim() === '') {
        console.log(`configuration#getNumberValue()  : Env [${envName}] is empty. Use default value [${defaultValue}]`);
        return defaultValue;
    }
    const rawValue = process.env[envName];
    const numberValue = Number(rawValue);
    if (Number.isNaN(numberValue)) {
        console.log(`configuration#getNumberValue()  : Env [${envName}] value is NaN [${rawValue}]. Use default value [${defaultValue}]`);
        return defaultValue;
    }
    console.log(`configuration#getNumberValue()  : Env [${envName}] = [${numberValue}]`);
    return numberValue;
};
const getBooleanValue = (envName) => {
    const isTruthy = process.env[envName] != null;
    console.log(`configuration#getBooleanValue() : Env [${envName}] = [${isTruthy}]`);
    return isTruthy;
};
const configuration = () => ({
    port: getNumberValue('PORT', 3000),
    host: getStringValue('HOST', 'neos21-oci.ml'),
    isHttp: getBooleanValue('IS_HTTP'),
    jwtSecret: getStringValue('JWT_SECRET', 'CHANGE-THIS'),
    noColour: getBooleanValue('NO_COLOR')
});
exports.configuration = configuration;
//# sourceMappingURL=configuration.js.map