/* eslint-disable no-console */
const fs = require('fs');
const MtaGraph = require('./mta-graph');
const GraphVizRenderer = require('./mta-graph-graphvis');

/**
 * Main
 */
async function main() {
    const mtaString = fs.readFileSync('./mta.yaml', 'utf8');

    const mtaGraph = MtaGraph.generate(mtaString);
    const renderedGraph = await GraphVizRenderer(mtaGraph);

    fs.writeFileSync('./mta.dot', renderedGraph.to_dot());

    renderedGraph.output('svg', 'mta.svg');
}

main();

console.log(`updated ${new Date()}`);
