import { ICliAction } from '@fp8proj/core';
import { loadDataFileIfNeeded } from '@fp8proj/cli';
import { processTemplate } from '@fp8proj/templater';

import {expect, readTestFile} from './testlib';

describe('index', () => {
    it('Test CLI actions', () => {
        const action: ICliAction = {
            yaml: 'test/data/config-a.yaml',
            templates: ['test/data/config-b.template.yaml'],
            dataFile: 'test/data/data.yaml',
            concatArray: true
        }
        const expected = readTestFile('config-merged.yaml');

        loadDataFileIfNeeded(action);
        const result = processTemplate(action);

        // console.log('result: ', result);
        expect(result).to.eql(expected);
    });
});
