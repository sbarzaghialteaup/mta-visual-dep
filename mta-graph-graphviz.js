const graphviz = require('graphviz');
const MtaGraph = require('mta-deps-parser');

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

const nodeRenderers = {
    [MtaGraph.nodeType.nodejs]: renderNodeJS,
    [MtaGraph.nodeType.dbDeployer]: renderDbDeployer,
    [MtaGraph.nodeType.deployer]: renderDeployer,
    [MtaGraph.nodeType.html5]: renderHtml5,
    [MtaGraph.nodeType.serviceHanaInstance]: renderServiceHanaInstance,
    [MtaGraph.nodeType.serviceHtml5Repo]: renderServiceHtml5,
    [MtaGraph.nodeType.serviceDestination]: renderServiceDestination,
    [MtaGraph.nodeType.serviceXsuaa]: renderServiceXsuaa,
    [MtaGraph.nodeType.servicePortal]: renderServicePortal,
    [MtaGraph.nodeType.serviceWorkflow]: renderServiceWorkflow,
    [MtaGraph.nodeType.destination]: renderDestination,
    [MtaGraph.nodeType.property]: renderProperty,
    [MtaGraph.nodeType.portalDeployer]: renderPortalDeployer,
    [MtaGraph.nodeType.approuter]: renderApprouter,
};

function getNodeAttributes(node) {
    const renderer = nodeRenderers[node.type];
    if (!renderer) {
        return {};
    }

    return renderer(node);
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

async function render(mtaGraph, customRenderers) {
    if (customRenderers) {
        Object.entries(customRenderers).forEach(([key, renderer]) => {
            nodeRenderers[key] = renderer;
        });
    }

    const mtaGraphViz = graphviz.digraph('MTA');
    const clusters = [];

    mtaGraph.nodes.forEach((node) => {
        mtaGraphViz.addNode(node.name, getNodeAttributes(node));

        node.links?.forEach((link) => {
            let cluster = mtaGraphViz;

            if (link.cluster) {
                const clusterId = `cluster_${link.cluster.replace(/ /g, '_')}`;

                cluster = clusters[clusterId];

                if (!cluster) {
                    cluster = mtaGraphViz.addCluster(clusterId);
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

    return mtaGraphViz;
}

module.exports = render;
