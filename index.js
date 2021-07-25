/* eslint-disable no-plusplus */
/* eslint-disable no-console */
const fs = require('fs');
const process = require('process');
const YAML = require('yaml');
const graphviz = require('graphviz');
const { exit } = require('process');

const categories = {
    module: 'module',
    resource: 'resource',
    destination: 'destination',
    property: 'property',
    enviromentVariable: 'enviromentVariable',
};

const nodeType = {
    nodejs: 'CAP SERVICE',
    approuter: 'APPROUTER',
    portalDeployer: 'PORTAL DEPLOYER',
    dbDeployer: 'DB DEPLOYER',
    deployer: 'DEPLOYER',
    html5: 'APP HTML5',
    serviceHanaInstance: 'HANA CLOUD',
    serviceHtml5Repo: 'HTML5 REPOSITORY',
    serviceXsuaa: 'SERVICE XSUAA',
    serviceDestination: 'SERVICE DESTINATION',
    serviceApplicationLog: 'SERVICE APPLICATION LOG',
    servicePortal: 'SERVICE PORTAL',
    destination: 'DESTINATION',
    destinationURL: 'DESTINATION URL',
    property: 'PROPERTY',
    enviromentVariable: 'ENV VARIABLE',
    other: 'OTHER',
};

const linkType = {
    readWrite: 'read/write',
    deployTablesTo: 'deploy tables to',
    createDestinationService: 'create destination service',
    useXsuaaService: 'use xsuaa service',
    defineDestination: 'defineDestination',
    pointToService: 'point to service',
    pointToUrl: 'point to url',
    useAppsFrom: 'use apps from',
    deployAppsTo: 'deploy apps to',
    deployApp: 'deploy app',
    publishAppsTo: 'publish apps into',
    logTo: 'log to',
    defineMtaProperty: 'define MTA property',
    defineEnvVariable: 'define enviroment\nvariable',
    useMtaProperty: 'use MTA property',
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

function renderServicePortal(node) {
    const nodeAttributes = {
        label: `{${node.type}|${node.name}}`,
        shape: `record`,
        color: `orange`,
    };
    return nodeAttributes;
}

function renderDestination(node) {
    const nodeAttributes = {
        label: `\\n\\n${node.name}`,
        shape: `underline`,
        color: `blue`,
    };
    return nodeAttributes;
}

function renderProperty(node) {
    const nodeAttributes = {
        label: `\\n${node.name}\n\n${node.value}`,
        shape: `note`,
        color: `grey`,
    };
    return nodeAttributes;
}

function renderPortalDeployer(node) {
    const nodeAttributes = {
        label: `\\n${node.type}\\n\\n${node.name}`,
        shape: `box3d`,
        color: `blue`,
    };
    return nodeAttributes;
}

function renderApprouter(node) {
    const nodeAttributes = {
        label: `\\n${node.type}\\n\\n${node.name}`,
        shape: `box3d`,
        color: `blue`,
    };
    return nodeAttributes;
}

function getNodeAttributes(node) {
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
    } else if (node.type === nodeType.servicePortal) {
        attributes = renderServicePortal(node);
    } else if (node.type === nodeType.destination) {
        attributes = renderDestination(node);
    } else if (node.type === nodeType.property) {
        attributes = renderProperty(node);
    } else if (node.type === nodeType.portalDeployer) {
        attributes = renderPortalDeployer(node);
    } else if (node.type === nodeType.approuter) {
        attributes = renderApprouter(node);
    }

    return attributes;
}

function getEdgeColor(link) {
    const colorMap = [];

    colorMap[linkType.deployTablesTo] = 'orange';
    colorMap[linkType.readWrite] = 'orange';
    colorMap[linkType.deployApp] = 'green';
    colorMap[linkType.defineMtaProperty] = 'grey';
    colorMap[linkType.useMtaProperty] = 'grey';

    return colorMap[link.type] ? colorMap[link.type] : 'black';
}

async function render(mtaGraph) {
    const mtaGraphVis = graphviz.digraph('MTA');
    const clusters = [];

    mtaGraph.forEach((node) => {
        mtaGraphVis.addNode(node.name, getNodeAttributes(node));

        node.link?.forEach((link) => {
            let cluster = mtaGraphVis;

            if (link.cluster) {
                const clusterId = `cluster_${link.cluster.replace(/ /g, '_')}`;

                cluster = clusters[clusterId];

                if (!cluster) {
                    cluster = mtaGraphVis.addCluster(clusterId);
                    cluster.set('label', link.cluster);

                    clusters[clusterId] = cluster;
                }
            }

            const e = cluster.addEdge(node.name, link.name, {
                label: link.type,
            });

            const color = getEdgeColor(link);

            e.set('color', color);
            e.set('fontcolor', color);
        });
    });

    fs.writeFileSync('./test.dot', mtaGraphVis.to_dot());

    mtaGraphVis.output('svg', 'test.svg');
}

function getNodeType(nodeInfo) {
    if (nodeInfo.additionalInfo.category === categories.module) {
        if (
            nodeInfo.additionalInfo.type === 'nodejs' &&
            nodeInfo.additionalInfo.module.path.search('approuter') >= 0
        ) {
            return nodeType.approuter;
        }
        if (nodeInfo.additionalInfo.type === 'nodejs') {
            return nodeType.nodejs;
        }
        if (nodeInfo.additionalInfo.type === 'hdb') {
            return nodeType.dbDeployer;
        }
        if (
            nodeInfo.additionalInfo.type === 'com.sap.application.content' &&
            nodeInfo.additionalInfo.module.path?.search('portal') >= 0
        ) {
            return nodeType.portalDeployer;
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
            if (nodeInfo.additionalInfo.service === 'application-logs') {
                return nodeType.serviceApplicationLog;
            }
            if (nodeInfo.additionalInfo.service === 'portal') {
                return nodeType.servicePortal;
            }
        }
    }

    return nodeType.other;
}

function getLinkType(link) {
    if (link.destNode.type === nodeType.serviceApplicationLog) {
        return linkType.logTo;
    }

    if (
        link.sourceNode.type === nodeType.nodejs &&
        link.destNode.type === nodeType.serviceHanaInstance
    ) {
        return linkType.readWrite;
    }

    if (
        link.sourceNode.type === nodeType.dbDeployer &&
        link.destNode.type === nodeType.serviceHanaInstance
    ) {
        return linkType.deployTablesTo;
    }

    if (
        link.sourceNode.type === nodeType.deployer &&
        link.destNode.type === nodeType.serviceDestination
    ) {
        return linkType.createDestinationService;
    }

    if (link.destNode.type === nodeType.serviceXsuaa) {
        return linkType.useXsuaaService;
    }

    if (
        link.sourceNode.type === nodeType.portalDeployer &&
        link.destNode.type === nodeType.serviceHtml5Repo
    ) {
        return linkType.useAppsFrom;
    }

    if (
        link.sourceNode.type === nodeType.portalDeployer &&
        link.destNode.type === nodeType.servicePortal
    ) {
        return linkType.publishAppsTo;
    }

    if (
        link.sourceNode.type === nodeType.deployer &&
        link.destNode.type === nodeType.serviceHtml5Repo
    ) {
        return linkType.deployAppsTo;
    }

    return 'use';
}

function getServiceDestinationNode(node) {
    const serviceDestinationLink = node.link.find(
        (link) => link.destNode.type === nodeType.serviceDestination
    );

    if (!serviceDestinationLink) {
        console.error(
            `Module ${node.name} with defined destinations but without service destination`
        );
        process.exit(1);
    }

    if (!serviceDestinationLink.destNode) {
        console.error(
            `Resource ${serviceDestinationLink.name} required by module ${node.name}`
        );
        process.exit(1);
    }

    return serviceDestinationLink.destNode;
}

function lookForDeployedDestinations(node, mtaGraph) {
    node.additionalInfo.module?.parameters?.content?.instance?.destinations?.forEach(
        (destination) => {
            const newDestinationNode = {
                name: destination.Name,
                type: nodeType.destination,
                additionalInfo: {
                    category: categories.destination,
                    destination,
                },
            };

            newDestinationNode.link = [];

            mtaGraph.push(newDestinationNode);

            const serviceDestinationNode = getServiceDestinationNode(node);

            serviceDestinationNode.link.push({
                type: linkType.defineDestination,
                name: destination.Name,
            });

            const pointToNode =
                mtaGraph.indexServiceName[destination.ServiceInstanceName];

            newDestinationNode.link.push({
                name: pointToNode.name,
                node: pointToNode,
                type: linkType.pointToService,
            });
        }
    );
}

function lookForDeployedApps(node) {
    node.additionalInfo.module?.['build-parameters']?.requires?.forEach(
        (destination) => {
            node.link.push({
                type: linkType.deployApp,
                name: destination.name,
            });
        }
    );
}

function extractModules(mta, mtaGraph) {
    mta.modules.forEach((module) => {
        const newNode = {
            name: module.name,
            additionalInfo: {
                category: categories.module,
                type: module.type,
                module,
            },
        };

        newNode.type = getNodeType(newNode);

        newNode.link = [];

        mtaGraph.push(newNode);
    });
}

function extractPropertySets(mtaGraph) {
    mtaGraph.forEach((moduleNode) => {
        moduleNode.additionalInfo.module.provides?.forEach((provide) => {
            mtaGraph.propertySets[provide.name] = moduleNode;

            Object.entries(provide.properties).forEach(([key, value]) => {
                const newPropertyNode = {
                    type: nodeType.property,
                    name: `${provide.name}:${key}`,
                    value,
                    additionalInfo: {
                        category: categories.property,
                    },
                };

                newPropertyNode.link = [];

                mtaGraph.push(newPropertyNode);

                mtaGraph.linksIndex[newPropertyNode.name] = newPropertyNode;

                moduleNode.link.push({
                    type: linkType.defineMtaProperty,
                    name: newPropertyNode.name,
                });
            });
        });
    });
}

function extractModulesRequirements(mtaGraph) {
    mtaGraph
        .filter((node) => node.additionalInfo.category === categories.module)
        .forEach((moduleNode) => {
            moduleNode.additionalInfo.module.requires?.forEach((require) => {
                if (mtaGraph.propertySets[require.name]) {
                    return;
                }

                moduleNode.link.push({
                    name: require.name,
                });
            });
        });
}

function extractEnviromentVariables(mtaGraph) {
    mtaGraph
        .filter((node) => node.additionalInfo.category === categories.module)
        .forEach((moduleNode) => {
            moduleNode.additionalInfo.module.requires?.forEach((require) => {
                if (!mtaGraph.propertySets[require.name]) {
                    return;
                }

                const newEnvVariableNode = {
                    type: nodeType.enviromentVariable,
                    name: require.group,
                    value: require.properties,
                    additionalInfo: {
                        category: categories.enviromentVariable,
                    },
                };

                newEnvVariableNode.link = [];

                mtaGraph.push(newEnvVariableNode);

                mtaGraph.linksIndex[newEnvVariableNode.name] =
                    newEnvVariableNode;

                moduleNode.link.push({
                    type: linkType.defineEnvVariable,
                    name: newEnvVariableNode.name,
                });

                const propertiesValue = Object.values(require.properties);

                for (let index = 0; index < propertiesValue.length; index++) {
                    const value = propertiesValue[index];

                    if (
                        typeof value === 'string' &&
                        value.substr(0, 2) === '~{'
                    ) {
                        const variableName = value.substr(2, value.length - 3);
                        const nodeName = `${require.name}:${variableName}`;

                        newEnvVariableNode.link.push({
                            type: linkType.useMtaProperty,
                            name: nodeName,
                        });
                    }
                }
            });
        });
}

function extractResources(mta, mtaGraph) {
    mta.resources.forEach((resource) => {
        const newNode = {
            name: resource.name,
            additionalInfo: {
                category: categories.resource,
                type: resource.type,
                service: resource.parameters.service,
                resource,
            },
        };

        newNode.type = getNodeType(newNode);

        newNode.link = [];

        mtaGraph.push(newNode);

        mtaGraph.linksIndex[newNode.name] = newNode;

        if (newNode.additionalInfo.resource?.parameters['service-name']) {
            mtaGraph.indexServiceName[
                newNode.additionalInfo.resource.parameters['service-name']
            ] = newNode;
        }
    });
}

function setLinksType(mtaGraph) {
    mtaGraph.forEach((node) => {
        node.link
            ?.filter((link) => !link.type)
            .forEach((link) => {
                if (mtaGraph.propertySets[link.name]) {
                    return;
                }

                link.sourceNode = node;
                link.destNode = mtaGraph.linksIndex[link.name];

                if (!link.destNode) {
                    console.error(
                        `Node '${link.sourceNode.name}' require link to node '${link.name}' but node '${link.name}' cannot be resolved`
                    );
                    exit(1);
                }
                link.type = getLinkType(link);
            });
    });
}

function extractDestinationsFromModules(mtaGraph) {
    mtaGraph.forEach((node) => {
        if (node.type === nodeType.deployer) {
            lookForDeployedDestinations(node, mtaGraph);
            lookForDeployedApps(node);
        }
    });
}

function extractDestinationsFromResources(mtaGraph) {
    mtaGraph
        .filter((node) => node.additionalInfo.category === categories.resource)
        .forEach((node) => {
            node.additionalInfo.resource.parameters?.config?.init_data?.instance?.destinations?.forEach(
                (destination) => {
                    const newDestinationNode = {
                        type: nodeType.destination,
                        name: destination.Name,
                        additionalInfo: {
                            category: categories.destination,
                            destination,
                        },
                    };

                    newDestinationNode.link = [];

                    mtaGraph.push(newDestinationNode);

                    node.link.push({
                        type: linkType.defineDestination,
                        name: destination.Name,
                    });

                    const newUrlNode = {
                        type: nodeType.destinationURL,
                        name: destination.URL,
                        additionalInfo: {
                            category: categories.destination,
                            destination,
                        },
                    };

                    newUrlNode.link = [];

                    mtaGraph.push(newUrlNode);

                    newDestinationNode.link.push({
                        type: linkType.pointToUrl,
                        name: newUrlNode.name,
                    });
                }
            );
        });
}

function setClusterToLinks(mtaGraph) {
    mtaGraph.forEach((node) => {
        node.link?.forEach((link) => {
            if (
                link.type === linkType.deployTablesTo ||
                link.type === linkType.readWrite
            ) {
                link.cluster = 'CAP SERVICE';
            }

            if (
                link.type === linkType.createDestinationService ||
                link.type === linkType.defineDestination ||
                link.type === linkType.pointToService ||
                link.type === linkType.pointToUrl
            ) {
                link.cluster = 'DESTINATION';
            }

            if (
                link.type === linkType.deployAppsTo ||
                link.type === linkType.deployApp
            ) {
                link.cluster = 'HTML5 APPS';
            }
        });
    });
}

/**
 * Main
 */
async function main() {
    const mtaGraph = [];

    mtaGraph.linksIndex = [];
    mtaGraph.indexServiceName = [];
    mtaGraph.propertySets = [];

    const file = fs.readFileSync('./mta.yaml', 'utf8');

    const mta = YAML.parse(file);

    extractModules(mta, mtaGraph);

    extractPropertySets(mtaGraph);

    extractModulesRequirements(mtaGraph);

    extractEnviromentVariables(mtaGraph);

    extractResources(mta, mtaGraph);

    setLinksType(mtaGraph);

    extractDestinationsFromModules(mtaGraph);

    extractDestinationsFromResources(mtaGraph);

    setClusterToLinks(mtaGraph);

    render(mtaGraph);
}

main();

console.log('updated ' + new Date());
