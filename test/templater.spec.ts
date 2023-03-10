import {expect, readTestFile} from './testlib';

import {ICliAction} from '@fp8proj/core';
import {processTemplate} from '@fp8proj/templater';

describe('templater', () => {
    it('processTemplate', () => {
        const action: ICliAction = {
            yaml: 'test/data/sample/main.yaml',
            templates: [
                'test/data/sample/config1.template.yaml',
                'test/data/sample/config2.template.yaml'
            ],
            concatArray: true
        };
        const expected = readTestFile('sample-expected.yaml');
        const result = processTemplate(action);

        expect(result).to.eql(expected);
    });
});
