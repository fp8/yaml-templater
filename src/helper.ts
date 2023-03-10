import * as fs from 'fs';
import * as yaml from 'js-yaml';
import * as _ from 'lodash';
import * as mustache from 'mustache';

import {
    IJson, TJsonEntry, TMapOfString
} from './core';

 /**
  * Private store of data to be used for templates.  Initalized with data from environment
  */
const _data: IJson = getEnvVariables();

/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Set render options:
 * - disable html espace
 * - tags becomes `${{variableX}}`
 */
const MUSTACHE_RENDER_OPTIONS: mustache.RenderOptions = {
    escape: (value: any) => value,
    tags: ['${{', '}}']
};

/**
 * Return if input isEmpty, and if string, trim it before checking
 * if empty.
 * 
 * @param input 
 * @returns 
 */
export function isBlank(input: unknown): boolean {
    if (typeof input === 'string') {
        return _.isEmpty(input.trim());
    } else if (_.isBoolean(input)) {
        return false;
    } else {
        return _.isEmpty(input);
    }
}

/**
 * Return env variable that matches:
 * 
 * 1. key name are all upper case
 * 2. key doens't start with _
 * 3. value is not blank
 *
 * @returns map of both key and value as string
 */
export function getEnvVariables(): TMapOfString {
    // Regex used to determine what env variable to include
    const uppercaseRegex = new RegExp("^[A-Z|0-9|_]+$");
    const result: TMapOfString = {};

    for (const key in process.env) {
        const env = process.env[key];
        if (
            key !== undefined &&
            !key.startsWith('_') && 
            uppercaseRegex.test(key) &&
            env !== undefined &&
            !_.isEmpty(env)
        ) {
            result[key] = env;
        }
    }

    return {
        ENV: result
    };
}

/**
 * Ensure that data provided is a valid key value where value
 * respect the TJsonEntry definition
 *
 * @param input 
 * @returns 
 */
export function cleanUpIJsonValue(input: TJsonEntry): TJsonEntry | undefined {
    /*if (_.isBoolean(input)) {
        if (input) {
            return 'true';
        } else {
            return 'false';
        }
    }*/

    if (_.isBoolean(input)) {
        return input;
    } else if (_.isNumber(input) || _.isFinite(input)) {
        return input;
    } else if (_.isDate(input)) {
        return input.toISOString();
    } else if (_.isArray(input)) {
        const output: Array<TJsonEntry> = [];
        for (const entry of input) {
            const cleaned = cleanUpIJsonValue(entry);
            if (cleaned !== undefined && !isBlank(cleaned)) {
                output.push(cleaned);
            }
        }
        return output;
    } else if (_.isPlainObject(input)) {
        const output: IJson = {};
        for (const [key, value] of Object.entries(input)) {
            const cleaned = cleanUpIJsonValue(value);
            if (cleaned !== undefined && !isBlank(cleaned)) {
                output[key] = cleaned;
            }
        }
        return output;
    } else if (_.isFunction(input)) {
        return undefined;
    }

    return input.toString();
}

/**
 * Merged incoming IJson with data
 *
 * @param input 
 */
export function mergeDataForTemplate(input: IJson): void {
    merge(_data, cleanUpIJsonValue(input) as IJson, true);
}

/**
 * Return data to be used by the template
 *
 * @returns 
 */
 export function getDataForTemplate(): IJson {
    return _data;
}

/**
 * Apply mustache template using as input env variable.  The variable
 * is defined using `${{variableX}}` as tags
 *
 * @param content 
 * @returns 
 */
export function applyTemplate(content: string): string {
    const data = getDataForTemplate();
    return mustache.render(content, data, {}, MUSTACHE_RENDER_OPTIONS);
}

/**
 * Private method that will force the contact of array when processing the _.merge
 *
 * @param objValue 
 * @param srcValue 
 * @returns 
 */
function mergeArray(objValue: unknown, srcValue: unknown): Array<unknown> | undefined {
    if (_.isArray(objValue)) {
        return objValue.concat(srcValue);
    } else {
        return;
    }
}

/**
 * Merge properties of 2 input object.
 * 
 * **Note**: This method will alter the input data!!!
 *
 * @param inputA 
 * @param template 
 * @param concatArray if true will always contat 2 array.  If false merge will override
 *                    based on position
 */
export function merge(input: IJson, template: IJson, concatArray = true): IJson {
    if (concatArray) {
        return _.mergeWith(input, template, mergeArray);
    } else {
        return _.merge(input, template);
    }
}

/**
 * Make sure that file pass ends with .yaml extension and that exists
 *
 * @param filepath 
 */
export function checkYamlFile(filepath: string): void {
    if (!(filepath.endsWith('.yaml') || filepath.endsWith('.yml'))) {
        throw new Error(`Only .yaml file accepted.  Received ${filepath}`);
    }
    if (!fs.existsSync(filepath)) {
        throw new Error(`${filepath} not found`);
    }
}

/**
 * Read a yaml file from a path.  If the filename ends with `*.template.yaml`,
 * assume that file contain mustache template.
 *
 * @param filepath 
 * @returns 
 */
export function readYaml(filepath: string): IJson {
    let text = fs.readFileSync(filepath, 'utf-8');

    if (filepath.endsWith('.template.yaml') || filepath.endsWith('.template.yml')) {
        text = applyTemplate(text);
    }

    return yaml.load(text) as IJson
}

/**
 * Out the input object as a yaml string
 *
 * @param input 
 * @returns 
 */
export function dumpYaml(input: IJson): string {
    return yaml.dump(input);
}

/**
 * Write the object into a yaml file
 */
export function writeYaml(filepath: string, data: IJson): void {
    const yaml = dumpYaml(data);
    fs.writeFileSync(filepath, yaml, 'utf8');
}
