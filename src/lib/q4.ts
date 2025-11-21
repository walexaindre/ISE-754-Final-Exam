import { NearestNeighbor } from "./q2";

export interface Savings {
    i: number;
    j: number;
    saving: number
}

export interface MergeAttempt {
    i: number;
    j: number;
    saving?: number;
    routeI?: Array<number>;
    routeJ?: Array<number>;
    feasible: boolean;
    reason?: string;
}

export function ExplainMergeAttempt(attempt: MergeAttempt): string {
    if (attempt.feasible) {
        return `Merged nodes ${attempt.i} and ${attempt.j} successfully. ${attempt.reason}`;
    } else {
        return `Could not merge nodes ${attempt.i} and ${attempt.j}. Reason: ${attempt.reason}`;
    }
}




export class VRP {
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

    routeDemand(route: Array<number>): number {
        let totalDemand = 0
        for (const node of route) {
            totalDemand += this.Demand[node]
        }
        return totalDemand
    }

    calculateDistance(route: Array<number>): number {
        let distance = 0
        for (let i = 0; i < route.length - 1; i++) {
            distance += this.DistanceMatrix[route[i]][route[i + 1]]
        }
        return distance
    }

    calculateRouteDemand(route: Array<number>): number {
        let totalDemand = 0
        for (const node of route) {
            totalDemand += this.Demand[node]
        }
        return totalDemand
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
            else if (routeI === routeJ) {
                this.MergeAttempts.push({
                    i: saving.i,
                    j: saving.j,
                    saving: saving.saving,
                    feasible: false,
                    routeI: this.Routes[routeI],
                    routeJ: this.Routes[routeJ],
                    reason: "Same route"
                })
            } else {
                const routeINodeCount = this.routeNodeCount(this.Routes[routeI])
                const routeJNodeCount = this.routeNodeCount(this.Routes[routeJ])
                const totalNodeCount = routeINodeCount + routeJNodeCount - 1
                if (totalNodeCount > this.RouteNodeLimit) {
                    this.MergeAttempts.push({
                        i: saving.i,
                        j: saving.j,
                        saving: saving.saving,
                        routeI: this.Routes[routeI],
                        routeJ: this.Routes[routeJ],
                        feasible: false,
                        reason: "Node limit exceeded"
                    })
                } else {
                    const routeIDemand = this.routeDemand(this.Routes[routeI])
                    const routeJDemand = this.routeDemand(this.Routes[routeJ])
                    const totalDemand = routeIDemand + routeJDemand
                    if (totalDemand > this.Q) {
                        this.MergeAttempts.push({
                            i: saving.i,
                            j: saving.j,
                            saving: saving.saving,
                            routeI: this.Routes[routeI],
                            routeJ: this.Routes[routeJ],
                            feasible: false,
                            reason: "Capacity exceeded"
                        })
                    } else {
                        const newRoute = this.Routes[routeI].slice(0, -1).concat(this.Routes[routeJ].slice(1))
                        this.MergeAttempts.push({
                            i: saving.i,
                            j: saving.j,
                            saving: saving.saving,
                            routeI: this.Routes[routeI],
                            routeJ: this.Routes[routeJ],
                            feasible: true,
                            reason: "Total demand: " + totalDemand + ", Total nodes: " + totalNodeCount
                        })
                        this.Routes.splice(Math.max(routeI, routeJ), 1)
                        this.Routes.splice(Math.min(routeI, routeJ), 1)
                        this.Routes.push(newRoute)

                    }
                }
            }
        }
    }

    optimizeRoutes() {
        for (let route of this.Routes) {
            route = NearestNeighbor(route.map(i => this.Coordinates[i]), 0)
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