/** 環境変数より文字列値を取得する・環境変数が存在しなければデフォルト値を使用する */
const getStringValue = (envName: string, defaultValue: string): string => {
  if(process.env[envName] == null || process.env[envName]!.trim() === '') {
    console.log(`configuration#getStringValue()  : Env [${envName}] is empty. Use default value [${defaultValue}]`);
    return defaultValue;
  }
  const stringValue = process.env[envName]!;
  console.log(`configuration#getStringValue()  : Env [${envName}] = [${stringValue}]`);
  return stringValue;
};

/** 環境変数より値を取得し数値型で返す・環境変数が存在しないか数値型に変換できない場合はデフォルト値を使用する */
const getNumberValue = (envName: string, defaultValue: number): number => {
  if(process.env[envName] == null || process.env[envName]!.trim() === '') {
    console.log(`configuration#getNumberValue()  : Env [${envName}] is empty. Use default value [${defaultValue}]`);
    return defaultValue;
  }
  const rawValue = process.env[envName]!;
  const numberValue = Number(rawValue);
  if(Number.isNaN(numberValue)) {
    console.log(`configuration#getNumberValue()  : Env [${envName}] value is NaN [${rawValue}]. Use default value [${defaultValue}]`);
    return defaultValue;
  }
  console.log(`configuration#getNumberValue()  : Env [${envName}] = [${numberValue}]`);
  return numberValue;
};

/** 当該の環境変数に何らかの値が設定されていれば `true`・未定義であれば `false` を返す */
const getBooleanValue = (envName: string): boolean => {
  const isTruthy = process.env[envName] != null;
  console.log(`configuration#getBooleanValue() : Env [${envName}] = [${isTruthy}]`);
  return isTruthy;
};

/** 環境変数のオブジェクトを返す : この関数内にオブジェクトを定義しないと環境変数が読み込まれない */
export const configuration = (): { [key: string]: string | number | boolean } => ({
  port     : getNumberValue ('PORT'      , 3000           ),  // ポート番号
  host     : getStringValue ('HOST'      , 'neos21-oci.ml'),  // ホスト (`https://example.com/` の `example.com` 部分)
  isHttp   : getBooleanValue('IS_HTTP'                    ),  // HTTP にするか否か
  jwtSecret: getStringValue ('JWT_SECRET', 'CHANGE-THIS'  ),  // JWT 認証のシークレット
  noColour : getBooleanValue('NO_COLOR'                   )   // ロガーの色付けをしない : NestJS のロガー `cli-colors.util.js` と同じ環境変数名・確認のため宣言
});
