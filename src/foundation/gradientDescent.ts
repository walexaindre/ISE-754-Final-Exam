export function GradientDescent2D(c1: number, c2: number, F: (c1: number, c2: number) => number, tol: number = 1e-7): [number, number] {
    const Objective = (c1: number, c2: number): number => F(c1, c2) * F(c1, c2);
    //Numeric gradient
    const Gradient = (c1: number, c2: number): [number, number] => {
        const h = 1e-7;
        const f_xmhy = Objective(c1 - h, c2);
        const f_xhy = Objective(c1 + h, c2);
        const f_xyh = Objective(c1, c2 + h);
        const f_xymh = Objective(c1, c2 - h);
        const dx = (f_xhy - f_xmhy) / (2 * h);
        const dy = (f_xyh - f_xymh) / (2 * h);
        return [dx, dy];
    }
    const Step = (c1: number, c2: number, c1prev: number, c2prev: number): number => {
        const [pdx, pdy] = Gradient(c1prev, c2prev);
        const [dx, dy] = Gradient(c1, c2);
        const norm = (pdx - dx) ** 2 + (pdy - dy) ** 2;
        return Math.abs(((c1 - c1prev) * pdx + (c2 - c2prev) * pdy) / norm);
    }

    let obj = Math.sqrt(Objective(c1, c2));
    let step = 0.05;
    let c1prev = 0;
    let c2prev = 0;

    let ctr = 0;

    while (obj > tol) {
        const [dx, dy] = Gradient(c1, c2);
        c1prev = c1
        c2prev = c2;
        c1 = c1 - step * dx;
        c2 = c2 - step * dy;
        const newObj = Math.sqrt(Objective(c1, c2));

        if (newObj < obj) {
            obj = newObj;
        }

        step = Step(c1, c2, c1prev, c2prev);
        ctr += 1;
        if (ctr > 2500) {
            console.log("GradientDescent2D: Max iterations reached");
            console.log("c1: ", c1, " c2: ", c2, " obj: ", obj);
            break;
        }
    }
    console.log("Gradient Descent: Iterations: ", ctr, "c1: ", c1, "c2: ", c2, " Final Objective: ", obj, " Final Step: ", step);
    return [c1, c2];
}