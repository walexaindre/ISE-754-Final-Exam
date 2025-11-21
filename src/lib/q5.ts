import { GradientDescent2D } from "../foundation/gradientDescent.js";

import { permutations } from "../foundation/permutation";


const Params = {
    transportationCostPerUnitDistance: 3,
}

export function CummulativeDemand(d: number) {
    if (d < 0) {
        console.log("CummulativeDemand: d out of bounds d: ", d);
        return 0;
    } else if (d < 500) {
        return 5 * d;
    } else if (d < 1000) {
        return 2500 + (d - 500)
    } else if (d <= 1500) {
        return 3000 + 5 * (d - 1000);
    } else {
        console.log("CummulativeDemand: d out of bounds d: ", d);
        return NaN;
    }
}

function RectangleArea(width: number, height: number) {
    return width * height;
}

export function IntegralCummulativeDemandZero(b: number): number {
    if (b <= 500) {
        return 5 * (b ** 2) / 2;
    } else if (b <= 1000) {
        return IntegralCummulativeDemandZero(500) + RectangleArea(b - 500, CummulativeDemand(500)) + ((b - 500) ** 2) / 2;
    } else if (b <= 1501) {
        return IntegralCummulativeDemandZero(1000) + RectangleArea(b - 1000, CummulativeDemand(1000)) + (5 * (b - 1000) ** 2) / 2;
    }
    return Infinity;
}

export function IntegralCummulativeDemand(a: number, b: number): number {
    return IntegralCummulativeDemandZero(b) - IntegralCummulativeDemandZero(a);
}

export function AccessCostInterval(a: number, b: number, p: number): number {
    //console.log(`AccessCostInterval a: ${a}, b: ${b}, p: ${p}`);
    const base = Params.transportationCostPerUnitDistance
    const leftSide = IntegralCummulativeDemand(a, p) - CummulativeDemand(a) * (p - a)
    const rightSide = CummulativeDemand(b) * (b - p) - IntegralCummulativeDemand(p, b)
    return base * (leftSide + rightSide)
}

export function TotalAccessCost(a: number, b: number, n: number): number {
    const Boundary: Array<number> = [];
    const locations = OptimalLocation(a, b, n, Boundary);
    let totalCost = 0;


    for (let i = 0; i < Boundary.length - 1; i++) {
        const left = Boundary[i];
        const right = Boundary[i + 1];
        const loc = locations[i];
        totalCost += AccessCostInterval(left, right, loc);
    }

    return totalCost;
}

export function TotalAccessCostForLocations(a: number, b: number, n: number, locations: Array<number>) {
    const sortedLocations = locations.slice().sort((x, y) => x - y);

    const Results: Array<{ locations: Array<number>, cost: number, left: number, right: number, delta: number, percentage: number, optimalCost: number }> = [];

    if (n == 1) {
        const optimalCost = TotalAccessCost(a, b, 1);

        for (let i = 0; i < sortedLocations.length - 1; i++) {

            const cost = AccessCostInterval(a, b, sortedLocations[i]);
            const delta = cost - optimalCost;
            const percentage = (delta / optimalCost) * 100;
            Results.push({ locations: [sortedLocations[i]], cost, left: a, right: b, delta, percentage, optimalCost });
        }
    }
    else if (n == 2) {
        const optimalCost = TotalAccessCost(a, b, 2);

        for (let i = 0; i < sortedLocations.length - 1; i++) {
            for (let j = i + 1; j < sortedLocations.length; j++) {
                const left = sortedLocations[i];
                const right = sortedLocations[j];
                const mid = OptimalLocation(left, right, 1)[0];

                const cost = AccessCostInterval(a, mid, sortedLocations[i]) + AccessCostInterval(mid, b, sortedLocations[j]);
                const delta = cost - optimalCost;
                const percentage = (delta / optimalCost) * 100;
                Results.push({ locations: [sortedLocations[i], sortedLocations[j]], cost, left, right, delta, percentage, optimalCost });
            }
        }
    } else if (n == 3) {
        const optimalCost = TotalAccessCost(a, b, 3);
        for (let i = 0; i < sortedLocations.length - 2; i++) {
            for (let j = i + 1; j < sortedLocations.length - 1; j++) {
                for (let k = j + 1; k < sortedLocations.length; k++) {
                    const left = sortedLocations[i];
                    const mid = sortedLocations[j];
                    const right = sortedLocations[k];

                    const optimalMidLeft = OptimalLocation(left, mid, 1)[0];
                    const optimalMidRight = OptimalLocation(mid, right, 1)[0];


                    const cost = AccessCostInterval(a, optimalMidLeft, sortedLocations[i]) +
                        AccessCostInterval(optimalMidLeft, optimalMidRight, sortedLocations[j]) +
                        AccessCostInterval(optimalMidRight, b, sortedLocations[k]);
                    const delta = cost - optimalCost;
                    const percentage = (delta / optimalCost) * 100;
                    Results.push({ locations: [sortedLocations[i], sortedLocations[j], sortedLocations[k]], cost, left, right, delta, percentage, optimalCost });
                }
            }
        }
    }

    return Results;
}


export function OptimalLocation(a: number, b: number, n: number, Boundary: Array<number> | null = null): Array<number> {
    if (n == 1) {
        const inte = IntegralCummulativeDemand(a, b)
        const fba = CummulativeDemand(a) - CummulativeDemand(b)
        const weight = CummulativeDemand(a) * a - CummulativeDemand(b) * b
        if (Boundary) {
            Boundary.push(a, b)
        }
        return [(inte + weight) / fba]
    }

    if (n == 2) {
        const Objective = (c: number): number => {
            return IntegralCummulativeDemand(c, b) / (b - c) - IntegralCummulativeDemand(a, c) / (c - a) - CummulativeDemand(c) + CummulativeDemand(a);
        }
        let left = a
        let right = b
        let mid = (left + right) / 2
        let cval = Objective(mid)
        while (Math.abs(cval) > 1e-5) {
            if (cval < 0) {
                right = mid
            } else {
                left = mid
            }
            mid = (left + right) / 2
            cval = Objective(mid)
        }

        if (Boundary) {
            Boundary.push(a, mid, b)
        }

        return [OptimalLocation(a, mid, 1)[0], OptimalLocation(mid, b, 1)[0]]
    }

    if (n == 3) {
        const F = (c1: number, c2: number): number => {
            return IntegralCummulativeDemand(a, c1) / (c1 - a) - IntegralCummulativeDemand(c2, b) / (b - c2) - CummulativeDemand(a) + CummulativeDemand(c2);
        }

        const mid = (a + b) / 2;

        let c1 = OptimalLocation(a, mid, 1)[0];
        let c2 = OptimalLocation(mid, b, 1)[0];

        [c1, c2] = GradientDescent2D(c1, c2, F, 1e-7);


        if (Boundary) {
            Boundary.push(a, c1, c2, b)
        }
        return [OptimalLocation(a, c1, 1)[0], OptimalLocation(c1, c2, 1)[0], OptimalLocation(c2, b, 1)[0]];
    }

    return []
}