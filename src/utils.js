export const createTestGraphThree = (numberOfVertices, maxWeight) => {
    const output = [];
    for (let index = 1; index < numberOfVertices; index++) {
        for (let secondaryIndex = index+1; secondaryIndex <= numberOfVertices; secondaryIndex++) {
            output.push({
                primaryVertex: index,
                secondaryVertex: secondaryIndex,
                cost: Math.round(Math.random() * maxWeight),
            })
        }
    }

    return output;
};

const getRandomTreeSplit = graphSize => {
    const divisons = [[], []];

    const inputArray = new Array(graphSize)
        .fill(0)
        .map((_, index) => index +1)
        .forEach(el => {
            if (divisons[0].length === graphSize / 2) divisons[1].push(el);
            else if (divisons[1].length === graphSize / 2) divisons[0].push(el);
            else {
                const divisonIndex = Math.round(Math.random());
                divisons[divisonIndex].push(el);
            }
    })

    return divisons;
};

const calculateDivisionCost = (graphDivison, graphWeights) => {
    return graphWeights.reduce((accumulator, edge) => {
            const indexes = [edge.primaryVertex, edge.secondaryVertex];

            const isInSameArray = (
                indexes.every(el => graphDivison[0].includes(el)) || 
                indexes.every(el => graphDivison[1].includes(el))
            );

            return isInSameArray ? accumulator : accumulator + edge.cost;
    }, 0)
};

export const getNDivisionsTest = ({ graphWeights, graphSize, numberOfTests }) => {
    let bestDivision = {
        cost: false,
        divisions: [],
        sumCost: 0,
        maximumCost: 0,
    };  

    new Array(numberOfTests).fill(0).forEach(() => {
        const division = getRandomTreeSplit(graphSize);
        const divisionCost = calculateDivisionCost(division, graphWeights);

        bestDivision = {
            ...bestDivision,
            sumCost: bestDivision.sumCost + divisionCost,
        }

        if (!bestDivision.cost || divisionCost < bestDivision.cost) {
            bestDivision = {
                ...bestDivision,
                cost: divisionCost,
                divisions: division,
            }
        }

        if (!bestDivision.maximumCost || (divisionCost > bestDivision.maximumCost)) {
            bestDivision.maximumCost = divisionCost
        }
    })

    return {
        ...bestDivision,
        averageCost: parseInt(bestDivision.sumCost / numberOfTests),
    };
};

const toRadian = (angle) => angle * Math.PI / 180;

export const getPolygon = (size) => {
    const baseRadius = 2;
    const circleRadius = 360;

    const singleAngle = circleRadius / size;

    return new Array(size).fill('*').map((_, index) => 
        [
            size * Math.cos(toRadian(singleAngle * (index +1))),
            size * Math.sin(toRadian(singleAngle * (index +1))),
        ]
    )
}