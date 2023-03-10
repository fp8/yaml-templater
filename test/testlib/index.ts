// tslint:disable-next-line
import 'mocha';

import chai = require('chai');
import sinon = require('sinon');
import sinonChai = require('sinon-chai');
import chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);
chai.use(sinonChai);

export const {expect} = chai;
export {sinon, chai};

// local
import * as fs from 'fs';

export function readTestFile(filepath: string): string {
    if (!filepath.startsWith('/')) {
        filepath = `test/data/${filepath}`;
    }
    return fs.readFileSync(filepath, 'utf-8');
}