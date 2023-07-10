// NestJS のロガー `cli-colors.util.js` を参考にしたロガーに色付けするための関数群

/** NestJS のロガーと同じ環境変数名を参照する */
const isColourAllowed = (): boolean => !process.env.NO_COLOR;
/** 色付けが許可されていたら色付けして出力する */
const colourIfAllowed = (colourFunction: (text: string) => string) => (text: string): string => isColourAllowed() ? colourFunction(text) : text;

export const red     = colourIfAllowed(text => `\x1B[31m${text}\x1B[39m`);
export const yellow  = colourIfAllowed(text => `\x1B[33m${text}\x1B[39m`);
export const green   = colourIfAllowed(text => `\x1B[32m${text}\x1B[39m`);
export const cyan    = colourIfAllowed(text => `\x1B[96m${text}\x1B[39m`);
export const magenta = colourIfAllowed(text => `\x1B[95m${text}\x1B[39m`);
export const grey    = colourIfAllowed(text => `\x1B[37m${text}\x1B[39m`);
