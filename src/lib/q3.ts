import { TotalDistance } from "./q2";
import { permutations } from "../foundation/permutation";

export function Opt2Exchange(route: Array<number>, dstMatrix: Array<Array<number>>, iterations: number): { route: Array<number>, history: { i: number; j: number, feasible: boolean, currentDistance: number, newDistance: number }[] } {
    const n = route.length;
    let countSwaps = 0;
    const Attempts: { i: number; j: number, feasible: boolean, currentDistance: number, newDistance: number }[] = [];

    let newRoute = route.slice();

    for (const [i, j] of permutations(Array.from({ length: n - 2 }, (_, k) => k), 2)) {
        [newRoute[i], newRoute[j]] = [newRoute[j], newRoute[i]];
        newRoute[n - 1] = newRoute[0];

        const currentDistance = TotalDistance(route, dstMatrix);
        const newDistance = TotalDistance(newRoute, dstMatrix);

        if (newDistance < currentDistance) {
            countSwaps++;
            route = newRoute.slice();
            Attempts.push({ i: i + 1, j: j + 1, feasible: true, currentDistance, newDistance });
        } else {
            Attempts.push({ i: i + 1, j: j + 1, feasible: false, currentDistance, newDistance });
            [newRoute[i], newRoute[j]] = [newRoute[j], newRoute[i]];
            newRoute[n - 1] = newRoute[0];
        }

        if (countSwaps >= iterations) {
            break;
        }

    }
    console.log("2-Opt swaps performed:", countSwaps);
    console.log("2-Opt final route distance:", TotalDistance(route, dstMatrix));
    console.log("Attempts:", Attempts.length);

    return { route, history: Attempts };
}

export function Opt3Exchange(route: Array<number>, dstMatrix: Array<Array<number>>, iterations: number): { route: Array<number>, history: { i: number; j: number; k: number; feasible: boolean; currentDistance: number; newDistance: number }[] } {
    const n = route.length;
    let countSwaps = 0;
    const Attempts: { i: number; j: number; k: number; feasible: boolean; currentDistance: number; newDistance: number }[] = [];

    let newRoute = route.slice();

    for (const [i, j, k] of permutations(Array.from({ length: n - 2 }, (_, l) => l), 3)) {

        [newRoute[j], newRoute[k], newRoute[i]] = [newRoute[i], newRoute[j], newRoute[k]];
        newRoute[n - 1] = newRoute[0];

        const currentDistance = TotalDistance(route, dstMatrix);
        const newDistance = TotalDistance(newRoute, dstMatrix);

        if (newDistance < currentDistance) {
            countSwaps++;
            route = newRoute.slice();
            Attempts.push({ i: i + 1, j: j + 1, k: k + 1, feasible: true, currentDistance, newDistance });
        } else {
            Attempts.push({ i: i + 1, j: j + 1, k: k + 1, feasible: false, currentDistance, newDistance });
            [newRoute[i], newRoute[j], newRoute[k]] = [newRoute[j], newRoute[k], newRoute[i]];
            newRoute[n - 1] = newRoute[0];
        }

        if (countSwaps >= iterations) {
            break;
        }


    }
    console.log("3-Opt swaps performed:", countSwaps);
    console.log("3-Opt final route distance:", TotalDistance(route, dstMatrix));
    console.log("Attempts:", Attempts.length);
    return { route, history: Attempts };
}