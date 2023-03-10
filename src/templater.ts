import {ICliAction} from './core';
import {
    readYaml, merge, dumpYaml
} from './helper';

/**
 * Main action of the script to parse the template and return the output
 * @returns 
 */
 export function processTemplate(action: ICliAction): string {
    // console.log(`### action: ${action.yaml} ${action.templates} ${action.concatArray}`);

    let result = readYaml(action.yaml);
    for (const templateFile of action.templates) {
        const template = readYaml(templateFile);
        result = merge(result, template, action.concatArray)
    }

    return dumpYaml(result);
}