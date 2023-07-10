"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.grey = exports.magenta = exports.cyan = exports.green = exports.yellow = exports.red = void 0;
const isColourAllowed = () => !process.env.NO_COLOR;
const colourIfAllowed = (colourFunction) => (text) => isColourAllowed() ? colourFunction(text) : text;
exports.red = colourIfAllowed(text => `\x1B[31m${text}\x1B[39m`);
exports.yellow = colourIfAllowed(text => `\x1B[33m${text}\x1B[39m`);
exports.green = colourIfAllowed(text => `\x1B[32m${text}\x1B[39m`);
exports.cyan = colourIfAllowed(text => `\x1B[96m${text}\x1B[39m`);
exports.magenta = colourIfAllowed(text => `\x1B[95m${text}\x1B[39m`);
exports.grey = colourIfAllowed(text => `\x1B[37m${text}\x1B[39m`);
//# sourceMappingURL=colour-logger.js.map