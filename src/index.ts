#!/usr/bin/env node

import {processTemplate} from './templater';
import {parseOpts, loadDataFileIfNeeded, showHelpAndExit} from './cli';

let result: string | undefined;

try {
    const action = parseOpts();
    loadDataFileIfNeeded(action);
    result = processTemplate(action);
} catch(e: unknown) {
    if (e instanceof Error) {
        console.error(e.message);
    } else {
        console.error(e);
    }
    showHelpAndExit();
}

if (result) {
    process.stdout.write(result);
}
