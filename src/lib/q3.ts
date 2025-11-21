import { TotalDistance } from "./q2";
import { permutations } from "../foundation/permutation";

function Opt2ExchangeBase(route: Array<number>, dstMatrix: Array<Array<number>>, iterations: number = 1): { route: Array<number>, history: { i: number; j: number, feasible: boolean, currentDistance: number, newDistance: number, delta: number, route: Array<number> }[] } {
    const n = route.length;
    let countSwaps = 0;
    const Attempts: { i: number; j: number, feasible: boolean, currentDistance: number, newDistance: number, delta: number, route: number[] }[] = [];

    let newRoute = route.slice();

    for (const [i, j] of permutations(Array.from({ length: n - 2 }, (_, k) => k), 2)) {
        [newRoute[i], newRoute[j]] = [newRoute[j], newRoute[i]];
        newRoute[n - 1] = newRoute[0];

        const currentDistance = TotalDistance(route, dstMatrix);
        const newDistance = TotalDistance(newRoute, dstMatrix);

        if (newDistance < currentDistance) {
            countSwaps++;
            route = newRoute.slice();
            Attempts.push({ i: route[i], j: route[j], feasible: true, currentDistance, newDistance, delta: currentDistance - newDistance, route: route.slice() });
        } else {
            Attempts.push({ i: route[i], j: route[j], feasible: false, currentDistance, newDistance, delta: currentDistance - newDistance, route: route.slice() });
            [newRoute[i], newRoute[j]] = [newRoute[j], newRoute[i]];
            newRoute[n - 1] = newRoute[0];
        }

        if (countSwaps >= iterations) {
            break;
        }

    }

    return { route, history: Attempts };
}

export function Opt2Exchange(route: Array<number>, dstMatrix: Array<Array<number>>, iterations: number): { route: Array<number>, history: { i: number; j: number, feasible: boolean, currentDistance: number, newDistance: number, delta: number, route: Array<number> }[] } {
    const Attempts: { i: number; j: number, feasible: boolean, currentDistance: number, newDistance: number, delta: number, route: number[] }[] = [];
    for (let iter = 0; iter < iterations; iter++) {
        const result = Opt2ExchangeBase(route, dstMatrix, 1);
        route = result.route;
        Attempts.push(...result.history);
    }
    return { route, history: Attempts };
}


export function Opt3Exchange(route: Array<number>, dstMatrix: Array<Array<number>>, iterations: number): { route: Array<number>, history: { i: number; j: number; k: number; feasible: boolean; currentDistance: number; newDistance: number, delta: number, route: Array<number> }[] } {
    const Attempts: { i: number; j: number; k: number; feasible: boolean; currentDistance: number; newDistance: number, delta: number, route: Array<number> }[] = [];
    for (let iter = 0; iter < iterations; iter++) {
        const result = Opt3ExchangeBase(route, dstMatrix, 1);
        route = result.route;
        Attempts.push(...result.history);
    }
    return { route, history: Attempts };
}
function Opt3ExchangeBase(route: Array<number>, dstMatrix: Array<Array<number>>, iterations: number = 1): { route: Array<number>, history: { i: number; j: number; k: number; feasible: boolean; currentDistance: number; newDistance: number, delta: number, route: Array<number> }[] } {
    const n = route.length;
    let countSwaps = 0;
    const Attempts: { i: number; j: number; k: number; feasible: boolean; currentDistance: number; newDistance: number; delta: number, route: number[] }[] = [];

    let newRoute = route.slice();

    for (const [i, j, k] of permutations(Array.from({ length: n - 2 }, (_, l) => l), 3)) {

        [newRoute[j], newRoute[k], newRoute[i]] = [newRoute[i], newRoute[j], newRoute[k]];
        newRoute[n - 1] = newRoute[0];

        const currentDistance = TotalDistance(route, dstMatrix);
        const newDistance = TotalDistance(newRoute, dstMatrix);

        if (newDistance < currentDistance) {
            countSwaps++;
            route = newRoute.slice();
            Attempts.push({ i: route[i], j: route[j], k: route[k], feasible: true, currentDistance, newDistance, delta: currentDistance - newDistance, route: route.slice() });
        } else {
            Attempts.push({ i: route[i], j: route[j], k: route[k], feasible: false, currentDistance, newDistance, delta: currentDistance - newDistance, route: route.slice() });
            [newRoute[i], newRoute[j], newRoute[k]] = [newRoute[j], newRoute[k], newRoute[i]];
            newRoute[n - 1] = newRoute[0];
        }

        if (countSwaps >= iterations) {
            break;
        }


    }

    return { route, history: Attempts };
}