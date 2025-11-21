export function* permutations<T>(iterable: Iterable<T>, r?: number): Generator<T[]> {
    const pool = Array.from(iterable);
    const n = pool.length;
    r = (r === undefined) ? n : r;

    if (r > n) return;

    const indices = [...Array(n).keys()];
    const cycles: number[] = [];
    for (let i = n; i > n - r; i--) cycles.push(i);

    yield indices.slice(0, r).map(i => pool[i]);

    while (n) {
        let broken = false;

        for (let i = r - 1; i >= 0; i--) {
            cycles[i] -= 1;

            if (cycles[i] === 0) {
                // rotate indices[i:]
                const removed = indices.splice(i, 1);
                indices.push(...removed);
                cycles[i] = n - i;
            } else {
                const j = cycles[i];
                const k = indices.length - j;

                // swap
                [indices[i], indices[k]] = [indices[k], indices[i]];

                yield indices.slice(0, r).map(i => pool[i]);

                broken = true;
                break;
            }
        }

        if (!broken) return;
    }
}
