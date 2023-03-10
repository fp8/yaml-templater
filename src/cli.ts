import * as os from 'os';
import * as getopts from "getopts"

import {ICliAction} from './core';
import {checkYamlFile, readYaml, mergeDataForTemplate, isBlank} from './helper';


export function showHelpAndExit(): void {
    const help = [
        "Usage: yaml-templater [--apply-array] [--data data.yaml] <main yaml> <yaml templates>"
    ].join(os.EOL);
    console.error(help);
    process.exit(1);
}

/**
 * Parse command argument for:
 * 
 * @main file to which the templates will be applied [required]
 * @templates template file(s) that will be applied to `main` [at least one]
 * @concatArray if array should be applied on top of concatenated [default true]
 */
export function parseOpts(args: string[] = process.argv.slice(2)): ICliAction  {
    const opt = getopts(args, {
        string: ['d'],
        boolean: ['a', 'h'],
        alias: {
            data: 'd',
            help: 'h',
            'apply-array': 'a'
        },
        unknown: (option: string) => {
            throw new Error(`Unknown option ${option}`);
        }
    });

    // console.debug('### opt', opt);

    if (opt.h) {
        showHelpAndExit();
    }

    // Check that if data file passed, it's a valid yaml file
    let dataFileOption: string | undefined = opt.d;
    if (isBlank(dataFileOption)) {
        dataFileOption = undefined;
    }
    
    if (dataFileOption) {
        checkYamlFile(dataFileOption);
    }

    // Check that all input are yaml
    const files = opt._;

    files.forEach(entry => {
        checkYamlFile(entry);
    });

    if (files.length < 2) {
        throw new Error('At least 2 yaml files expected');
    }

    const yaml = files[0];
    // de dup entries
    const templates = new Set(files.slice(1));
    if (templates.has(yaml)) {
        templates.delete(yaml);
    }

    const concatArray = !opt.a;
    return {
        yaml,
        templates: Array.from(templates),
        dataFile: dataFileOption,
        concatArray
    };
}

/**
 * If the dataFile exists, load it and merge it with env variable
 * to be used by the templates
 *
 * @param action 
 */
export function loadDataFileIfNeeded(action: ICliAction): void {
    if (action.dataFile) {
        const data = readYaml(action.dataFile);
        mergeDataForTemplate(data);
        // console.info(`- Using data from ${action.dataFile}`);
    }
}
