const graphviz = require('graphviz');
const MtaGraph = require('./mta-graph');

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

function renderServiceWorkflow(node) {
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

    if (node.type === MtaGraph.nodeType.nodejs) {
        attributes = renderNodeJS(node);
    } else if (node.type === MtaGraph.nodeType.dbDeployer) {
        attributes = renderDbDeployer(node);
    } else if (node.type === MtaGraph.nodeType.deployer) {
        attributes = renderDeployer(node);
    } else if (node.type === MtaGraph.nodeType.html5) {
        attributes = renderHtml5(node);
    } else if (node.type === MtaGraph.nodeType.serviceHanaInstance) {
        attributes = renderServiceHanaInstance(node);
    } else if (node.type === MtaGraph.nodeType.serviceHtml5Repo) {
        attributes = renderServiceHtml5(node);
    } else if (node.type === MtaGraph.nodeType.serviceDestination) {
        attributes = renderServiceDestination(node);
    } else if (node.type === MtaGraph.nodeType.serviceXsuaa) {
        attributes = renderServiceXsuaa(node);
    } else if (node.type === MtaGraph.nodeType.servicePortal) {
        attributes = renderServicePortal(node);
    } else if (node.type === MtaGraph.nodeType.serviceWorkflow) {
        attributes = renderServiceWorkflow(node);
    } else if (node.type === MtaGraph.nodeType.destination) {
        attributes = renderDestination(node);
    } else if (node.type === MtaGraph.nodeType.property) {
        attributes = renderProperty(node);
    } else if (node.type === MtaGraph.nodeType.portalDeployer) {
        attributes = renderPortalDeployer(node);
    } else if (node.type === MtaGraph.nodeType.approuter) {
        attributes = renderApprouter(node);
    }

    return attributes;
}

function getEdgeColor(link) {
    const colorMap = [];

    colorMap[MtaGraph.linkType.deployTablesTo] = 'orange';
    colorMap[MtaGraph.linkType.readWrite] = 'orange';
    colorMap[MtaGraph.linkType.deployApp] = 'green';
    colorMap[MtaGraph.linkType.defineMtaProperty] = 'grey';
    colorMap[MtaGraph.linkType.useMtaProperty] = 'grey';

    return colorMap[link.type] ? colorMap[link.type] : 'black';
}

async function render(mtaGraph) {
    const mtaGraphVis = graphviz.digraph('MTA');
    const clusters = [];

    mtaGraph.nodes.forEach((node) => {
        mtaGraphVis.addNode(node.name, getNodeAttributes(node));

        node.links?.forEach((link) => {
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

    return mtaGraphVis;
}

module.exports = render;