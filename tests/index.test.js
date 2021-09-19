/* eslint-disable no-console */
const fs = require('fs');
const md5 = require('md5');

const MtaVisualDep = require('../src/index');

const tests = [
    {
        mtaFilename: 'tests/solutions-mta.yaml',
        expectedFilename: 'tests/solutions-mta.svg',
        expectedMd5: '1481af3610a11425d85c6c61074b1696',
    },
    {
        mtaFilename: 'tests/hana-opensap-cloud-mta.yaml',
        expectedFilename: 'tests/hana-opensap-cloud-mta.svg',
        expectedMd5: '9f72e640b16227513948225604c338b3',
    },
    {
        mtaFilename: 'tests/mta-teched-2020-ui.yaml',
        expectedFilename: 'tests/mta-teched-2020-ui.svg',
        expectedMd5: '6a342aac6ddd8638c2480ea9a980f842',
    },
    {
        mtaFilename: 'tests/mta-teched-2020-s4hana.yaml',
        expectedFilename: 'tests/mta-teched-2020-s4hana.svg',
        expectedMd5: '2a0174d6dc51d13af446f341b65969f5',
    },
    {
        mtaFilename: 'tests/workflow-mta.yaml',
        expectedFilename: 'tests/workflow-mta.svg',
        expectedMd5: '1e3044f40b9f6a35b8a65566c5419d3b',
    },
    {
        mtaFilename: 'tests/bookshop-demo-mta-cf.yaml',
        expectedFilename: 'tests/bookshop-demo-mta-cf.svg',
        expectedMd5: 'c6227b86327dffb4f29d658345098b53',
    },
    {
        mtaFilename: 'tests/mta-cap-mtx.yaml',
        expectedFilename: 'tests/mta-cap-mtx.svg',
        expectedMd5: '74e3db9179edd9eacfa143fd3f3d5b30',
    },
    {
        mtaFilename: 'tests/cold-chain-mta.yaml',
        expectedFilename: 'tests/cold-chain-mta.svg',
        expectedMd5: '5b279a89c8432e18d293e6b9747add1e',
    },
    {
        mtaFilename: 'tests/mta-fiori-app-approuter-managed.yaml',
        expectedFilename: 'tests/mta-fiori-app-approuter-managed.svg',
        expectedMd5: '35bb0660435d7c154d32e8bf4cd31a9d',
    },
    {
        mtaFilename: 'tests/optional-self-host-cap.yaml',
        expectedFilename: 'tests/optional-self-host-cap.svg',
        expectedMd5: 'afae4e7fbae5ee1edb00ef028bc95a96',
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
