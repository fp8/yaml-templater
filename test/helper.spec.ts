import {expect} from './testlib';
import * as _ from 'lodash';

import * as Helper from '@fp8proj/helper';
import { IJson, TMapOfString } from '@fp8proj/core';


class TestMessage {
    public message: string;

    constructor (input: string) {
        this.message = input;
    }

    toString(): string {
        return `Message from ${this.message}`;
    }
}

describe('Helper', () => {

    it('Check isEmpty on string', () => {
        expect(Helper.isBlank('')).to.be.true;
        expect(Helper.isBlank(null)).to.be.true;
        expect(Helper.isBlank(undefined)).to.be.true;
        expect(Helper.isBlank('  ')).to.be.true;
        expect(Helper.isBlank('abc')).to.be.false;
    });

    it('Helper.getEnvVariables', () => {
        const envs = Helper.getEnvVariables().ENV as TMapOfString;
        // env FP8PROJKEY is expected to be set
        expect(envs.FP8PROJKEY).to.eql('TKuNFwIosI');
    });

    it('Helper.cleanUpIJsonValue', () => {
        const dateString = '2022-08-22T12:13:14.000Z';
        const dt = new Date(dateString);

        /*
        Special varialbe tests:
        - dt is expected to be converted to iso string
        - lodash is a function so it's ignored
        - Helper is a collection of functions thus the empty result is also ignored
        - message: a class that overrides toString to return expected data
        - promise is an object so calling it's toString method
        */
        const data: any = {
            dt,
            lodash: _,
            helper: Helper,
            entries: ['one', dt, 'three'],
            message: new TestMessage('iaeRiWF4QC'),
            promise: Promise.resolve(),
            struct: {
                dt,
                message: 'this is struct',
                isNested: true
            },
            isProcessing: true,
            isRunning: false
        };

        const expected = {
            dt: dateString,
            promise: '[object Promise]',
            entries: [ 'one', dateString, 'three' ],
            message: 'Message from iaeRiWF4QC',
            struct: {
                dt: dateString,
                message: 'this is struct',
                isNested: true
            },
            isProcessing: true,
            isRunning: false
        };

        expect(Helper.cleanUpIJsonValue(data)).to.deep.equal(expected);
    });

    it('Helper.mergeDataForTemplate', () => {
        expect(Helper.getDataForTemplate().entryA).to.be.undefined;
        expect(Helper.getDataForTemplate().entryB).to.be.undefined;
        expect(Helper.getDataForTemplate().entryC).to.be.undefined;

        const additionalData = Helper.readYaml('test/data/data.yaml');
        Helper.mergeDataForTemplate(additionalData);

        expect(Helper.getDataForTemplate().entryA).to.be.eql('pWTbQCRBIL');
        expect(Helper.getDataForTemplate().entryB).to.be.eql(['VzEBefK1HL', 'W9NjmUfwvU']);
        expect(Helper.getDataForTemplate().entryC).to.be.true;
    });

    it('Helper.applyTemplate', () => {
        const template = [
            'name: app-${{ENV.FP8PROJKEY}}',
            'projectId: id-${{ENV.FP8PROJKEY}}-gcloud',
            'entryA: ${{entryA}}',
            'entryB: ${{entryB}}',
            'entryC: ${{entryC}}'
        ].join('\n');

        const expected = [
            'name: app-TKuNFwIosI',
            'projectId: id-TKuNFwIosI-gcloud',
            'entryA: pWTbQCRBIL',
            'entryB: VzEBefK1HL,W9NjmUfwvU',
            'entryC: true'
        ].join('\n');

        const applied = Helper.applyTemplate(template);
        
        expect(
            applied
        ).to.eql(
            expected
        );
    });

    it('read yaml plain', () => {
        const configA = Helper.readYaml('test/data/config-a.yaml');
        expect(configA.name).to.eql('configA-ymi2Vu2ZFX');

        const grpc = configA.grpc as Array<IJson>;
        expect(grpc[0].server).to.eql('tsgrpcdev.fp8.me');
    });

    it('read yaml template', () => {
        const configB = Helper.readYaml('test/data/config-b.template.yaml');
        expect(configB.name).to.eql('configB-TKuNFwIosI');

        const expected = Helper.readYaml('test/data/config-b.yaml');
        expect(configB).to.eql(expected);
    });

    it('merge contactArray=true', () => {
        const objA = {
            a: [1, 2],
            b: [3, 4]
        };
        const objB = {
            b: [5, 6]
        }

        expect(Helper.merge(objA, objB)).to.eql({
            a: [1, 2],
            b: [3, 4, 5, 6]
        });
    });

    it('merge contactArray=false', () => {
        const objA = {
            a: [1, 2],
            b: [3, 4]
        };
        const objB = {
            b: [5, 6]
        }

        expect(Helper.merge(objA, objB, false)).to.eql({
            a: [1, 2],
            b: [5, 6]
        });
    });

    it('merge yaml', () => {
        const configA = Helper.readYaml('test/data/config-a.yaml');
        const configB = Helper.readYaml('test/data/config-b.template.yaml');

        const expected = Helper.readYaml('test/data/config-merged.yaml');

        const merged = Helper.merge(configA, configB);
        // Helper.writeYaml('test/data/config-merged.yaml', merged);
        
        expect(merged).to.eql(expected);
    });
});
