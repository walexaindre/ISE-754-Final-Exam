import NetworkData from "../assets/q2arcs.json";
import NodeData from "../assets/q2node.json";

export const NetworkNodes: Array<NetworkNode> = NodeData as Array<NetworkNode>;
export const NetworkDataLinks: Array<NetworkLink> = NetworkData as Array<NetworkLink>;

export interface NetworkLink {
    init_node: number,
    term_node: number,
    time: number,
}

export interface NetworkNode {
    node: number,
    x: number,
    y: number
}

export function NearestNeighbor(startIndex: number, dstMatrix: Array<Array<number>>): Array<number> {
    startIndex = startIndex - 1;
    const n = dstMatrix.length
    const visited: Array<boolean> = new Array(n).fill(false)
    const route: Array<number> = []
    let currentIndex = startIndex
    visited[currentIndex] = true
    route.push(currentIndex)

    for (let step = 1; step < n; step++) {
        let nearestIndex = -1
        let nearestDistance = Infinity
        for (let i = 0; i < n; i++) {
            if (!visited[i]) {
                const distance = dstMatrix[currentIndex][i]
                if (distance < nearestDistance) {
                    nearestDistance = distance
                    nearestIndex = i
                }
            }
        }
        if (nearestIndex >= 0) {
            visited[nearestIndex] = true
            route.push(nearestIndex)
            currentIndex = nearestIndex
        }
    }
    route.push(startIndex);
    //1-based index
    return route.map(i => i + 1);
}

export function NearestInsertion(startIndex: number, dstMatrix: Array<Array<number>>): Array<number> {
    startIndex = startIndex - 1;
    const n = dstMatrix.length
    const visited: Array<boolean> = new Array(n).fill(false)
    const route: Array<number> = []
    visited[startIndex] = true
    route.push(startIndex)

    while (route.length < n) {
        let nearestIndex = -1
        let nearestDistance = Infinity
        let insertPosition = -1

        for (let i = 0; i < n; i++) {
            if (!visited[i]) {
                for (let j = 0; j < route.length; j++) {
                    const fromIndex = route[j]
                    const toIndex = route[(j + 1) % route.length]
                    const distance = dstMatrix[fromIndex][i] + dstMatrix[i][toIndex] - dstMatrix[fromIndex][toIndex]
                    if (distance < nearestDistance) {
                        nearestDistance = distance
                        nearestIndex = i
                        insertPosition = j + 1
                    }
                }
            }
        }

        if (nearestIndex >= 0 && insertPosition >= 0) {
            visited[nearestIndex] = true
            route.splice(insertPosition, 0, nearestIndex)
        }
    }

    route.push(startIndex);
    //1-based index
    return route.map(i => i + 1);
}

export function TotalDistance(route: Array<number>, dstMatrix: Array<Array<number>>): number {
    let totalDistance = 0;
    for (let i = 0; i < route.length - 1; i++) {
        const fromIndex = route[i] - 1;
        const toIndex = route[i + 1] - 1;
        totalDistance += dstMatrix[fromIndex][toIndex];
    }
    return totalDistance;
}