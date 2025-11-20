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
    } else if (b <= 1500) {
        return IntegralCummulativeDemandZero(1000) + RectangleArea(b - 1000, CummulativeDemand(1000)) + (5 * (b - 1000) ** 2) / 2;
    }
    return Infinity;
}

export function IntegralCummulativeDemand(a: number, b: number): number {
    return IntegralCummulativeDemandZero(b) - IntegralCummulativeDemandZero(a);
}

export function AccessCostInterval(a: number, b: number, p: number): number {
    const base = Params.transportationCostPerUnitDistance
    const leftSide = IntegralCummulativeDemand(a, p) - CummulativeDemand(a) * (p - a)
    const rightSide = CummulativeDemand(b) * (b - p) - IntegralCummulativeDemand(p, b)
    return base * (leftSide + rightSide)
}

function AccessCost(a: number, b: number, points: Array<number>): number {

    return 1;
}


function OptimalLocation(a: number, b: number, n: number): Array<number> {
    if (n == 1) {
        const inte = IntegralCummulativeDemand(a, b)
        const fba = CummulativeDemand(a) - CummulativeDemand(b)
        const weight = CummulativeDemand(a) * a - CummulativeDemand(b) * b
        return [(inte + weight) / fba]
    }

    if (n > 1) {
        let bestPoints: Array<number> = []
    }


    return []
}