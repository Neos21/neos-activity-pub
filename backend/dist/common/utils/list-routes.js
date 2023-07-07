"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listRoutes = void 0;
const expressListEndpoints = require("express-list-endpoints");
const colour_logger_1 = require("./colour-logger");
const listRoutes = (router) => {
    const endpoints = expressListEndpoints(router);
    const longestPathLength = Math.max(...endpoints.map((endpoint) => endpoint.path.length));
    const methodsColourFunctions = {
        'GET': colour_logger_1.green,
        'POST': colour_logger_1.cyan,
        'PUT': colour_logger_1.yellow,
        'PATCH': colour_logger_1.yellow,
        'DELETE': colour_logger_1.red,
        'OPTIONS': colour_logger_1.grey
    };
    const methodsOrders = Object.keys(methodsColourFunctions);
    const prepareMethods = (methods) => methods
        .sort((methodA, methodB) => methodsOrders.indexOf(methodA) - methodsOrders.indexOf(methodB))
        .map(method => {
        const colourFunction = methodsColourFunctions[method];
        return colourFunction ? colourFunction(method) : method;
    })
        .join(', ');
    const logText = `${(0, colour_logger_1.yellow)('Routes :')}\n` + endpoints.map((endpoint) => `    - ${endpoint.path.padEnd(longestPathLength, ' ')} : ${prepareMethods(endpoint.methods)}`).sort().join('\n');
    return logText;
};
exports.listRoutes = listRoutes;
//# sourceMappingURL=list-routes.js.map