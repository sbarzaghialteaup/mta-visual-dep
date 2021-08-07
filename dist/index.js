#!/usr/bin/env node
/* eslint-disable no-console */
const fs = require('fs');
const MtaDeps = require('mta-deps-parser');
const GraphVizRenderer = require('mta-deps-graphviz');

/**
 * Main
 */
async function main() {
    const mtaString = fs.readFileSync('./mta.yaml', 'utf8');

    const mtaGraph = MtaDeps.parse(mtaString);
    const renderedGraph = await GraphVizRenderer(mtaGraph);

    fs.writeFileSync('./mta.dot', renderedGraph.to_dot());

    renderedGraph.output('svg', 'mta.svg');

    console.log(`File mta.svg updated at ${new Date()}`);
}

main();
