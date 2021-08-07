/* eslint-disable no-console */
const main = require('../dist/index');

test('to_dot return something', async () => {
    expect(main).toEqual(expect.anything());
});
