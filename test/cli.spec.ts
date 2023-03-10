import {expect} from './testlib';

import {parseOpts} from '@fp8proj/cli';

describe('cli', () => {
    it('normal', () => {
        const args = [
            '--data', 'test/data/data.yaml',
            'test/data/config-a.yaml',
            'test/data/config-b.template.yaml'
        ];

        const action = parseOpts(args);
        // console.log(action);

        expect(action).to.eql({
            yaml: 'test/data/config-a.yaml',
            templates: [ 'test/data/config-b.template.yaml' ],
            dataFile: 'test/data/data.yaml',
            concatArray: true
        });
    });

    it('apply-array', () => {
        const args = [
            '--data', 'test/data/data.yaml',
            'test/data/config-a.yaml',
            'test/data/config-b.template.yaml',
            '--apply-array'
        ];

        const action = parseOpts(args);
        // console.log(action);

        expect(action).to.eql({
            yaml: 'test/data/config-a.yaml',
            templates: [ 'test/data/config-b.template.yaml' ],
            dataFile: 'test/data/data.yaml',
            concatArray: false
        });
    });

    it('no data', () => {
        const args = [
            'test/data/config-a.yaml',
            'test/data/config-b.template.yaml',
            '--apply-array'
        ];

        const action = parseOpts(args);
        // console.log(action);

        expect(action).to.eql({
            yaml: 'test/data/config-a.yaml',
            templates: [ 'test/data/config-b.template.yaml' ],
            dataFile: undefined,
            concatArray: false
        });
    });

    it('short options', () => {
        const args = [
            '-a',
            '-d', 'test/data/data.yaml',
            'test/data/config-a.yaml',
            'test/data/config-b.template.yaml'
        ];

        const action = parseOpts(args);
        // console.log(action);

        expect(action).to.eql({
            yaml: 'test/data/config-a.yaml',
            templates: [ 'test/data/config-b.template.yaml' ],
            dataFile: 'test/data/data.yaml',
            concatArray: false
        });
    });
    
    it('unknown options', () => {
        const args = [
            '--data', 'test/data/data.yaml',
            'test/data/config-a.yaml',
            'test/data/config-b.template.yaml',
            '--apply-array',
            '--output', 'expectedValue'
        ];

        expect(() => {parseOpts(args)}).to.throw('Unknown option output');
    });
});