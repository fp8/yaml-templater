export type TMapOfString = {[key: string]: string | TMapOfString};

export type TJsonEntry = string | number | boolean | IJson | Array<TJsonEntry>;

export interface IJson {
    [key: string]: TJsonEntry;
}

/* eslint-disable @typescript-eslint/no-empty-interface*/
export interface IJsonArray extends Array<TJsonEntry> {}

/**
 * Action returned by parsing the command line
 */
export interface ICliAction {
    yaml: string;
    templates: string[];
    dataFile?: string;
    concatArray: boolean;
}
