/* eslint-disable no-console */
const fs = require('fs');
const md5 = require('md5');

const MtaVisualDep = require('../src/index');

const tests = [
    {
        mtaFilename: 'tests/solutions-mta.yaml',
        expectedFilename: 'tests/solutions-mta.svg',
        expectedMd5: 'f0c06faa8c7319ac185625799666a677',
    },
    {
        mtaFilename: 'tests/hana-opensap-cloud-mta.yaml',
        expectedFilename: 'tests/hana-opensap-cloud-mta.svg',
        expectedMd5: '94ae01499acda795b2508e8d8f441aba',
    },
    {
        mtaFilename: 'tests/mta-teched-2020-ui.yaml',
        expectedFilename: 'tests/mta-teched-2020-ui.svg',
        expectedMd5: '5cde5406f1f1a53f01f7825d91d608c2',
    },
    {
        mtaFilename: 'tests/mta-teched-2020-s4hana.yaml',
        expectedFilename: 'tests/mta-teched-2020-s4hana.svg',
        expectedMd5: '2a0174d6dc51d13af446f341b65969f5',
    },
    {
        mtaFilename: 'tests/workflow-mta.yaml',
        expectedFilename: 'tests/workflow-mta.svg',
        expectedMd5: 'e31b44791b8085efd679082fae938ad6',
    },
    {
        mtaFilename: 'tests/bookshop-demo-mta-cf.yaml',
        expectedFilename: 'tests/bookshop-demo-mta-cf.svg',
        expectedMd5: '9fc7ac28a8c99bc49c8519b58b774bbc',
    },
    {
        mtaFilename: 'tests/mta-cap-mtx.yaml',
        expectedFilename: 'tests/mta-cap-mtx.svg',
        expectedMd5: 'e29b407acdb875a862be4523891289d9',
    },
    {
        mtaFilename: 'tests/cold-chain-mta.yaml',
        expectedFilename: 'tests/cold-chain-mta.svg',
        expectedMd5: '0cf1ca9c9e830f37226d4c49eb20224b',
    },
    {
        mtaFilename: 'tests/mta-fiori-app-approuter-managed.yaml',
        expectedFilename: 'tests/mta-fiori-app-approuter-managed.svg',
        expectedMd5: '1d5fff655af61886ad9cb66a117055df',
    },
    {
        mtaFilename: 'tests/optional-self-host-cap.yaml',
        expectedFilename: 'tests/optional-self-host-cap.svg',
        expectedMd5: '06b57ddb6989b46dd777de1ab99b9749',
    },
];

beforeAll(async () => {
    tests.forEach((testData) => {
        try {
            fs.unlinkSync(testData.expectedFilename);
            // eslint-disable-next-line no-empty
        } catch (error) {}
    });
});

async function waitForGeneratedFile() {
    return new Promise((resolve) => {
        setTimeout(() => resolve(), 500);
    });
}

async function testWithFile(filename, expectedFilename, expectedMd5) {
    const generatedFilename = await MtaVisualDep(filename);

    expect(generatedFilename).toEqual(expectedFilename);

    await waitForGeneratedFile();

    const generatedFile = fs.readFileSync(generatedFilename);
    expect(md5(generatedFile)).toEqual(expectedMd5);
}

tests.forEach(async (testData) => {
    test(`Test with file ${testData.mtaFilename}`, async () => {
        await testWithFile(
            testData.mtaFilename,
            testData.expectedFilename,
            testData.expectedMd5
        );
    });
});
