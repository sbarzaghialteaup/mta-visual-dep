#!/usr/bin/env node
/* eslint-disable no-console */
const fs = require('fs');
const MtaDeps = require('mta-deps-parser');
const GraphVizRenderer = require('mta-deps-graphviz');
const updateNotifier = require('update-notifier');
const pkg = require('../package.json');

/**
 * Main
 */
async function main(fileName) {
    const mtaString = fs.readFileSync(fileName, 'utf8');

    const mtaGraph = MtaDeps.parse(mtaString);
    const renderedGraph = await GraphVizRenderer(mtaGraph);

    fs.writeFileSync('./mta.dot', renderedGraph.to_dot());

    renderedGraph.output('svg', 'mta.svg');

    console.log(`File mta.svg updated at ${new Date()}`);
}

updateNotifier({ pkg, updateCheckInterval: 0 }).notify({ isGlobal: true });

const fileName = process.argv[2] ? process.argv[2] : './mta.yaml';
main(fileName);
