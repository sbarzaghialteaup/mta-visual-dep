/* eslint-disable no-console */
const fs = require('fs');
const YAML = require('yaml');
const graphviz = require('graphviz');

const categories = {
    module: 'module',
};

const nodeType = {
    nodejs: 'CAP SERVICE',
    dbDeployer: 'DB DEPLOYER',
    deployer: 'DEPLOYER',
    html5: 'APP HTML5',
};

function renderNodeJS(node) {
    const nodeAttributes = {
        label: `\\n${node.type}\\n\\n${node.name}`,
        shape: `house`,
        color: `blue`,
    };
    return nodeAttributes;
}

function renderDbDeployer(node) {
    const nodeAttributes = {
        label: `\\n${node.type}\\n\\n${node.name}`,
        shape: `box3d`,
        color: `blue`,
    };
    return nodeAttributes;
}

function renderDeployer(node) {
    const nodeAttributes = {
        label: `\\n${node.type}\\n\\n${node.name}`,
        shape: `box3d`,
        color: `blue`,
    };
    return nodeAttributes;
}

function renderHtml5(node) {
    const nodeAttributes = {
        label: `\\n${node.type}\\n\\n${node.name}`,
        shape: `rect`,
        color: `green`,
    };
    return nodeAttributes;
}

function renderNode(node) {
    let attributes = {};

    if (node.type === nodeType.nodejs) {
        attributes = renderNodeJS(node);
    } else if (node.type === nodeType.dbDeployer) {
        attributes = renderDbDeployer(node);
    } else if (node.type === nodeType.deployer) {
        attributes = renderDeployer(node);
    } else if (node.type === nodeType.html5) {
        attributes = renderHtml5(node);
    }

    console.log(attributes);
    return attributes;
}

async function render(mtaGraph) {
    const mtaGraphVis = graphviz.graph('MTA');

    mtaGraph.forEach((node) => {
        mtaGraphVis.addNode(node.name, renderNode(node));
    });

    fs.writeFileSync('./test.dot', mtaGraphVis.to_dot());

    mtaGraphVis.output('svg', 'test.svg');
}

function getNodeType(nodeInfo) {
    if (nodeInfo.additionalInfo.category === categories.module) {
        if (nodeInfo.additionalInfo.type === 'nodejs') {
            return nodeType.nodejs;
        }
        if (nodeInfo.additionalInfo.type === 'hdb') {
            return nodeType.dbDeployer;
        }
        if (nodeInfo.additionalInfo.type === 'com.sap.application.content') {
            return nodeType.deployer;
        }
        if (nodeInfo.additionalInfo.type === 'html5') {
            return nodeType.html5;
        }
    }

    return nodeType.other;
}

async function main() {
    const mtaGraph = [];

    const file = fs.readFileSync('./mta.yaml', 'utf8');

    const mta = YAML.parse(file);

    mta.modules.forEach((module) => {
        const newNode = {
            name: module.name,
            additionalInfo: { category: categories.module, type: module.type },
        };

        newNode.type = getNodeType(newNode);

        mtaGraph.push(newNode);
    });

    render(mtaGraph);
}

main();
