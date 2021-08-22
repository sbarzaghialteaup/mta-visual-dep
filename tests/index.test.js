/* eslint-disable no-console */
const fs = require('fs');
const md5 = require('md5');

const MtaVisualDep = require('../src/index');

const tests = [
    {
        mtaFilename: 'tests/solutions-mta.yaml',
        expectedFilename: 'tests/solutions-mta.svg',
        expectedMd5: '531534c2917169ecec7cacb7db323bb9',
    },
    {
        mtaFilename: 'tests/hana-opensap-cloud-mta.yaml',
        expectedFilename: 'tests/hana-opensap-cloud-mta.svg',
        expectedMd5: '11e63c515953f635527908de2b9fdfbe',
    },
    {
        mtaFilename: 'tests/mta-teched-2020-ui.yaml',
        expectedFilename: 'tests/mta-teched-2020-ui.svg',
        expectedMd5: 'be6580780c097829b4e89b044a412e60',
    },
    {
        mtaFilename: 'tests/mta-teched-2020-s4hana.yaml',
        expectedFilename: 'tests/mta-teched-2020-s4hana.svg',
        expectedMd5: '582140b0cf094b7f809e91d8865543ea',
    },
    {
        mtaFilename: 'tests/workflow-mta.yaml',
        expectedFilename: 'tests/workflow-mta.svg',
        expectedMd5: 'dccc74909646de3972d369f8d3a5e293',
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
