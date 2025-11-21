export interface Edge<T> {
    from: T;
    to: T;
    weight: number;
}

export function FloydWarshall<T>(nodes: Array<T>, edges: Array<Edge<T>>): Array<Array<number>> {
    const n = nodes.length;
    const dist: Array<Array<number>> = new Array(n);
    const nodeIndex: Map<T, number> = new Map();

    for (let i = 0; i < n; i++) {
        nodeIndex.set(nodes[i], i);
        dist[i] = new Array(n).fill(Infinity);
        dist[i][i] = 0;
    }

    for (const edge of edges) {
        const u = nodeIndex.get(edge.from);
        const v = nodeIndex.get(edge.to);
        if (u !== undefined && v !== undefined) {
            dist[u][v] = edge.weight;
        }
    }

    for (let k = 0; k < n; k++) {
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                if (dist[i][j] > dist[i][k] + dist[k][j]) {
                    dist[i][j] = dist[i][k] + dist[k][j];
                }
            }
        }
    }

    return dist;
}