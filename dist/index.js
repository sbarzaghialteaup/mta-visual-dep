#!/usr/bin/env node
/* eslint-disable no-console */
const fs = require('fs');
const debug = require('debug')('mta-visual-dep');
const MtaDeps = require('mta-deps-parser');
const GraphVizRenderer = require('mta-deps-graphviz');
const updateNotifier = require('update-notifier');
const path = require('path');
const pkg = require('../package.json');

/**
 * Main
 */
async function main(fileName) {
    const mtaString = fs.readFileSync(fileName, 'utf8');

    const mtaGraph = MtaDeps.parse(mtaString);
    const renderedGraph = await GraphVizRenderer(mtaGraph);

    const mtaFilename = path.parse(fileName);
    debug('Dirname: %s', mtaFilename.dir);
    debug('Basename: %s', mtaFilename.name);

    const svgFilename = path.format({
        dir: mtaFilename.dir,
        name: mtaFilename.name,
        ext: '.svg',
    });

    await renderedGraph.output('svg', svgFilename);

    console.log(`File ${svgFilename} updated at ${new Date()}`);

    return svgFilename;
    // fs.writeFileSync('./mta.dot', renderedGraph.to_dot());
}

// Directly executed by shell?
if (require.main === module) {
    // Yes, start main
    updateNotifier({ pkg, updateCheckInterval: 0 }).notify({ isGlobal: true });

    const fileName = process.argv[2] ? process.argv[2] : './mta.yaml';
    main(fileName);
} else {
    // No, export main
    module.exports = main;
}
