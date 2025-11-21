function euclideanDistance(A: [number, number], B: [number, number]): number {
    return Math.sqrt(
        (A[0] - B[0]) ** 2 +
        (A[1] - B[1]) ** 2
    )
}

export function NearestNeighbor(locations: Array<[number, number]>, startIndex: number): Array<number> {
    const n = locations.length
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
                const distance = euclideanDistance(locations[currentIndex], locations[i])
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
    return route
}