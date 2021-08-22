/* eslint-disable no-console */
const fs = require('fs');
const md5 = require('md5');

const MtaVisualDep = require('../src/index');

const tests = [
    {
        mtaFilename: 'tests/solutions-mta.yaml',
        expectedFilename: 'tests/solutions-mta.svg',
        expectedMd5: '0f90973e4d9c6b0ef5c8c819dbca8c7d',
    },
    {
        mtaFilename: 'tests/hana-opensap-cloud-mta.yaml',
        expectedFilename: 'tests/hana-opensap-cloud-mta.svg',
        expectedMd5: '62e28d93c579e38e65fe62dc3f7e7e89',
    },
    {
        mtaFilename: 'tests/mta-teched-2020-ui.yaml',
        expectedFilename: 'tests/mta-teched-2020-ui.svg',
        expectedMd5: 'f7872749d790622e7de9368093f9923f',
    },
    {
        mtaFilename: 'tests/mta-teched-2020-s4hana.yaml',
        expectedFilename: 'tests/mta-teched-2020-s4hana.svg',
        expectedMd5: '582140b0cf094b7f809e91d8865543ea',
    },
    {
        mtaFilename: 'tests/workflow-mta.yaml',
        expectedFilename: 'tests/workflow-mta.svg',
        expectedMd5: '2f1f83e5a652e856d4ecc7183579a249',
    },
    {
        mtaFilename: 'tests/bookshop-demo-mta-cf.yaml',
        expectedFilename: 'tests/bookshop-demo-mta-cf.svg',
        expectedMd5: '2a2f786f2631e15a61f7bcc9b0397d1d',
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
