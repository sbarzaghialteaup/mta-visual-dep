/* eslint-disable no-console */
const fs = require('fs');
const YAML = require('yaml');
const graphviz = require('graphviz');

const categories = {
    module: 'module',
    resource: 'resource',
};

const nodeType = {
    nodejs: 'CAP SERVICE',
    dbDeployer: 'DB DEPLOYER',
    deployer: 'DEPLOYER',
    html5: 'APP HTML5',
    serviceHanaInstance: 'HANA CLOUD',
    serviceHtml5Repo: 'HTML5 REPOSITORY',
    serviceXsuaa: 'XSUAA',
    serviceDestination: 'DESTINATION',
};

const linkType = {
    readWrite: 'read/write',
    deploy: 'deploy',
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
function renderServiceHanaInstance(node) {
    const nodeAttributes = {
        label: `\\n${node.type}\\n\\n${node.name}`,
        shape: `cylinder`,
        color: `orange`,
    };
    return nodeAttributes;
}
function renderServiceHtml5(node) {
    const nodeAttributes = {
        label: `\\n${node.type}\\n\\n${node.name}`,
        shape: `folder`,
        color: `orange`,
    };
    return nodeAttributes;
}

function renderServiceDestination(node) {
    const nodeAttributes = {
        label: `\\n${node.type}\\n\\n${node.name}`,
        shape: `cds`,
        color: `orange`,
    };
    return nodeAttributes;
}

function renderServiceXsuaa(node) {
    const nodeAttributes = {
        label: `{${node.type}|${node.name}}`,
        shape: `record`,
        color: `orange`,
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
    } else if (node.type === nodeType.serviceHanaInstance) {
        attributes = renderServiceHanaInstance(node);
    } else if (node.type === nodeType.serviceHtml5Repo) {
        attributes = renderServiceHtml5(node);
    } else if (node.type === nodeType.serviceDestination) {
        attributes = renderServiceDestination(node);
    } else if (node.type === nodeType.serviceXsuaa) {
        attributes = renderServiceXsuaa(node);
    }

    console.log(attributes);
    return attributes;
}

async function render(mtaGraph) {
    const mtaGraphVis = graphviz.graph('MTA');

    mtaGraph.forEach((node) => {
        mtaGraphVis.addNode(node.name, renderNode(node));

        node.link?.forEach((link) => {
            mtaGraphVis.addEdge(node.name, link.name, {
                label: link.type,
            });
        });
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

    if (nodeInfo.additionalInfo.category === categories.resource) {
        if (nodeInfo.additionalInfo.type === 'com.sap.xs.hdi-container') {
            return nodeType.serviceHanaInstance;
        }
        if (
            nodeInfo.additionalInfo.type === 'org.cloudfoundry.managed-service'
        ) {
            if (nodeInfo.additionalInfo.service === 'html5-apps-repo') {
                return nodeType.serviceHtml5Repo;
            }
            if (nodeInfo.additionalInfo.service === 'xsuaa') {
                return nodeType.serviceXsuaa;
            }
            if (nodeInfo.additionalInfo.service === 'destination') {
                return nodeType.serviceDestination;
            }
        }
    }

    return nodeType.other;
}

function getLinkType(link) {
    if (
        link.sourceNode.type === nodeType.nodejs &&
        link.destNode.type === nodeType.serviceHanaInstance
    ) {
        return 'read/write';
    }

    if (
        link.sourceNode.type === nodeType.dbDeployer &&
        link.destNode.type === nodeType.serviceHanaInstance
    ) {
        return 'deploy to';
    }

    if (
        link.sourceNode.type === nodeType.deployer &&
        link.destNode.type === nodeType.serviceDestination
    ) {
        return 'deploy destinations';
    }

    if (
        link.sourceNode.type === nodeType.deployer &&
        link.destNode.type === nodeType.serviceXsuaa
    ) {
        return 'deploy xsuaa';
    }

    return 'deploy';
}

/**
 * Main
 */
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

        newNode.link = [];

        module.requires?.forEach((require) => {
            newNode.link.push({
                name: require.name,
            });
        });

        mtaGraph.push(newNode);
    });

    mtaGraph.indexes = [];

    mta.resources.forEach((resource) => {
        const newNode = {
            name: resource.name,
            additionalInfo: {
                category: categories.resource,
                type: resource.type,
                service: resource.parameters.service,
            },
        };

        newNode.type = getNodeType(newNode);

        mtaGraph.push(newNode);
        mtaGraph.indexes[newNode.name] = newNode;
    });

    mtaGraph.forEach((sourceNode) => {
        sourceNode.link?.forEach((link) => {
            link.sourceNode = sourceNode;
            link.destNode = mtaGraph.indexes[link.name];

            link.type = getLinkType(link);
        });
    });

    render(mtaGraph);
}

main();
