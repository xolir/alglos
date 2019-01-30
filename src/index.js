import sigma from 'sigma';
import './plugins';
import { getNDivisionsTest, createTestGraphThree, getPolygon } from './utils';

const container = new sigma('app'); 

container.settings({
    edgeColor: 'default',
    minEdgeSize: 0,
    maxEdgeSize: 2,
    edgeLabelSize: 'proportional'
});

const selectors = {
    graphSize: '#vert',
    tries: '#tries',
    cost: '#cost',
    startButton: "#start",
    costNode: '#costs',
    divCost: '#divCost span',
    medianCost: '#medianCost span',
    maxCost: '#highestCost span',
}

const renderGraph = () => {
    container.graph.clear();

    const graphSize = parseInt(document.querySelector(selectors.graphSize).value);
    const numberOfTests = parseInt(document.querySelector(selectors.tries).value);
    const maxCost = parseInt(document.querySelector(selectors.cost).value);
    const costsNode = document.querySelector(selectors.costNode)
    const divisionCostNode = document.querySelector(selectors.divCost);
    const divisionAverageCostNode = document.querySelector(selectors.medianCost);
    const divisionMaxCostNode = document.querySelector(selectors.maxCost);

    costsNode.classList.add('active');

    const graph = createTestGraphThree(graphSize, maxCost);

    console.table(graph);

    const graphLength = graph.length;
    const maxWidth = Math.sqrt(graphSize);

    const split = getNDivisionsTest({ graphWeights: graph, graphSize, numberOfTests });

    const positions = getPolygon(graphSize);

    new Array(graphSize).fill('*').map((_, index) => {
        container.graph.addNode({
            id: index +1,
            label: index +1,
            size: 1,
            x: positions[index][0],
            y: positions[index][1],
            color: getVertexColour(split.divisions, (index +1))
        })
    });

    graph.map((el, index) => container.graph.addEdge({
        id: `${el.primaryVertex}_${el.secondaryVertex}`,
        source: el.primaryVertex,
        target: el.secondaryVertex,
        color: getEdgeColour(split.divisions, el.primaryVertex, el.secondaryVertex),
        size: el.cost / 10,
        label: el.cost
    }));
    
    container.refresh();

    divisionCostNode.innerHTML = split.cost;
    divisionAverageCostNode.innerHTML = split.averageCost;
    divisionMaxCostNode.innerHTML = split.maximumCost;
}

const getEdgeColour = (divisions, primaryVertex, secondaryVertex) => {
    if (divisions[0].includes(primaryVertex) && divisions[0].includes(secondaryVertex)) return '#ff0000';
    else  if (divisions[1].includes(primaryVertex) && divisions[1].includes(secondaryVertex)) return '#0000ff';
    else return '#d2d0d0';
}

const getVertexColour = (divisions, vertex) => {
    if (divisions[0].includes(vertex)) return '#ff0000';
    else return '#0000ff';
}

document.querySelector(selectors.startButton).addEventListener('click', renderGraph);