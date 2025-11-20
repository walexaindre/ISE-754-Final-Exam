interface Savings {
    i: number;
    j: number;
    saving: number
}

interface MergeAttempt {
    i: number;
    j: number;
    feasible: boolean;
    reason?: string;
}

class VRP {
    Q: number // Truck capacity
    RouteNodeLimit: number // Max number of nodes in a route including depot
    Coordinates: Array<[number, number]> // Coordinates of points
    Demand: Array<number> // Demand at each point
    DistanceMatrix: Array<Array<number>> // Distance matrix between points
    Routes: Array<Array<number>> = [] // Routes
    savingList: Array<Savings> = [] // Savings list

    MergeAttempts: Array<MergeAttempt> = []

    constructor(
        Q: number,
        RouteNodeLimit: number,
        Coordinates: Array<[number, number]>,
        Demand: Array<number>
    ) {
        this.Q = Q
        this.RouteNodeLimit = RouteNodeLimit
        this.Coordinates = Coordinates
        this.Demand = Demand
        this.DistanceMatrix = this.matrixDistance()
        this.initializeClarkeWrightRoutes()
        this.savingList = this.calculateSavings()
    }

    routeNodeCount(route: Array<number>): number {
        return route.length - 1
    }

    calculateTotalDistance(): number {
        let totalDistance = 0
        for (const route of this.Routes) {
            for (let i = 0; i < route.length - 1; i++) {
                totalDistance +=
                    this.DistanceMatrix[route[i]][route[i + 1]]
            }
        }
        return totalDistance
    }

    findRouteContainingNode(node: number): number | null {
        for (let r = 0; r < this.Routes.length; r++) {
            if (this.Routes[r].includes(node)) {
                return r
            }
        }
        return null
    }

    merge() {
        for (const saving of this.savingList) {
            const routeI = this.findRouteContainingNode(saving.i)
            const routeJ = this.findRouteContainingNode(saving.j)
            if (routeI === null || routeJ === null) {
                console.log("This should never happen!! => Merge: route not found for nodes ", saving.i, saving.j)
                continue
            }
        }
    }

    initializeClarkeWrightRoutes() {
        const n = this.Coordinates.length
        for (let i = 1; i < n; i++) {
            this.Routes.push([0, i, 0])
        }
    }

    calculateSavings(): Array<Savings> {
        const savings: Array<Savings> = []
        const n = this.Coordinates.length
        for (let i = 1; i < n; i++) {
            for (let j = i + 1; j < n; j++) {
                const saving =
                    this.DistanceMatrix[0][i] +
                    this.DistanceMatrix[0][j] -
                    this.DistanceMatrix[i][j]
                savings.push({ i, j, saving })
            }
        }
        savings.sort((a, b) => b.saving - a.saving)
        return savings
    }

    euclideanDistance(v1: [number, number], v2: [number, number]): number {
        return Math.sqrt((v1[0] - v2[0]) ** 2 + (v1[1] - v2[1]) ** 2)
    }

    matrixDistance(): Array<Array<number>> {
        const n = this.Coordinates.length
        let matrix: Array<Array<number>> = []
        for (let i = 0; i < n; i++) {
            matrix.push([])
            for (let j = 0; j < n; j++) {
                matrix[i].push(this.euclideanDistance(this.Coordinates[i], this.Coordinates[j]))
            }
        }
        return matrix
    }

}