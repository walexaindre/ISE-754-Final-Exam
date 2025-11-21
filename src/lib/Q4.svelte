<script lang="ts">
    import { ExplainMergeAttempt, VRP } from "./q4";
    import * as Plot from "@observablehq/plot";

    let depotIndex: number = 0;

    let demand: Array<number> = $state([
        0, 50, 100, 50, 100, 50, 50, 50, 50, 50, 50, 100, 50, 50,
    ]);
    let locations: Array<[number, number]> = $state([
        [50, 50],
        [70, 95],
        [90, 80],
        [82, 63],
        [75, 58],
        [90, 48],
        [98, 52],
        [90, 40],
        [60, 40],
        [46, 37],
        [30, 48],
        [20, 55],
        [20, 70],
        [30, 90],
    ]);

    function addEntry(demandValue: number, x: number, y: number) {
        demand.push(demandValue);
        locations.push([x, y]);
    }

    function removeEntry(index: number) {
        if (demand.length > 1) {
            demand.splice(index, 1);
            locations.splice(index, 1);
        }
    }

    let dadd = $state(0);
    let xadd = $state(0);
    let yadd = $state(0);

    function add() {
        addEntry(dadd, xadd, yadd);
        dadd = 0;
        xadd = 0;
        yadd = 0;
    }

    function PlotLocations() {
        const plot = Plot.plot({
            marks: [
                Plot.dot(
                    locations.map((loc, i) => ({
                        x: loc[0],
                        y: loc[1],
                        r: 50,
                    })),
                    { x: "x", y: "y", r: "r", fill: "magenta", opacity: 0.9 },
                ),
                Plot.text(
                    locations.map((loc, i) => ({
                        x: loc[0],
                        y: loc[1],
                        label: i.toString(),
                    })),
                    {
                        x: "x",
                        y: "y",
                        text: "label",
                        fontSize: 14,
                        dy: -12,
                        dx: -5,
                        fill: "currentColor",
                    },
                ),
            ],
            width: 600,
            height: 400,
            x: { label: "X Coordinate" },
            y: { label: "Y Coordinate" },
        });

        return plot;
    }

    function PlotRoutes() {
        const colors = [
            "blue",
            "green",
            "orange",
            "purple",
            "cyan",
            "magenta",
            "brown",
            "pink",
        ];

        const RouteLines: Plot.Line[] = [];
        let colorIndex = 0;
        for (const route of vrp.Routes) {
            const line = route
                .map((nodeIndex) => locations[nodeIndex])
                .map((loc) => ({ x: loc[0], y: loc[1] }));

            RouteLines.push(
                Plot.line(line, {
                    x: "x",
                    y: "y",
                    stroke: colors[colorIndex % colors.length],
                    strokeWidth: 2,
                }),
            );
            colorIndex++;
        }

        const plot = Plot.plot({
            marks: [
                ...RouteLines,
                Plot.dot(
                    locations.map((loc, i) => ({
                        x: loc[0],
                        y: loc[1],
                        r: 50,
                    })),
                    { x: "x", y: "y", r: "r", fill: "red", opacity: 0.9 },
                ),
                Plot.text(
                    locations.map((loc, i) => ({
                        x: loc[0],
                        y: loc[1],
                        label: i.toString(),
                    })),
                    {
                        x: "x",
                        y: "y",
                        text: "label",
                        fontSize: 14,
                        dy: -12,
                        dx: -5,
                        fill: "currentColor",
                    },
                ),
            ],
            width: 600,
            height: 400,
            x: { label: "X Coordinate" },
            y: { label: "Y Coordinate" },
        });

        return plot;
    }

    let vrp: VRP = $state(new VRP(300, 6, locations, demand));
    vrp.merge();
    vrp.MergeAttempts;

    let tab = $state(0);
</script>

<div class="flex justify-center">
    <div role="tablist" class="tabs tabs-border">
        <button
            role="tab"
            class="tab {tab == 0 ? 'tab-active' : ''}"
            onclick={() => {
                tab = 0;
            }}>Summary</button
        >
        <button
            role="tab"
            onclick={() => {
                tab = 1;
            }}
            class="tab {tab == 1 ? 'tab-active' : ''}"
            >Demand and Locations</button
        >
        <button
            role="tab"
            onclick={() => {
                tab = 2;
            }}
            class="tab {tab == 2 ? 'tab-active' : ''}">Merge Attempts</button
        >
    </div>
</div>

{#if tab == 0}
    <div class=" grid grid-cols-2">
        <div class="w-full col-span-2 my-4">
            <div class="flex justify-center">
                {@html PlotRoutes().outerHTML}
            </div>
        </div>
        <div class="mx-4 py-4">
            <table class="table border-base-content/5 border-2">
                <thead>
                    <tr>
                        <th
                            class="text-center font-bold text-lg text-primary"
                            colspan="2"
                        >
                            Summary
                        </th>
                    </tr>
                    <tr>
                        <th class="text-left">Parameter</th>
                        <th class=" text-center">Value</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td class="font-bold"> Total demand </td>
                        <td class="text-center">
                            {demand.reduce((a, b) => a + b, 0)}
                        </td>
                    </tr>
                    <tr>
                        <td class="font-bold">Truck Capacity</td>
                        <td class="text-center">300</td>
                    </tr>
                    <tr>
                        <td class="font-bold">Max nodes per route</td>
                        <td class="text-center">6</td>
                    </tr>
                    <tr>
                        <td class="font-bold">Depot Location</td>
                        <td class="text-center"
                            >Node {depotIndex} ({locations[depotIndex]})</td
                        >
                    </tr>
                    <tr>
                        <td class="font-bold"> Number of Routes </td>
                        <td class="text-center">{vrp.Routes.length}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="mx-4 py-4">
            <table class="table border-base-content/5 border-2">
                <thead>
                    <tr>
                        <th
                            class="text-center font-bold text-lg text-primary"
                            colspan="4"
                        >
                            Routes
                        </th>
                    </tr>
                    <tr>
                        <th class="w-10 text-center">Route #</th>
                        <th class="text-center">Nodes</th>
                        <th class="w-20 text-center">Demand</th>
                        <th class="w-20 text-center">Cost</th>
                    </tr>
                </thead>

                <tbody>
                    {#each vrp.Routes as route, i}
                        <tr>
                            <td class="text-center">{i + 1}</td>
                            <td class="text-center">{route.join("-")}</td>
                            <td class="text-center">
                                {vrp
                                    .calculateRouteDemand(route)
                                    .toLocaleString("en", {
                                        useGrouping: true,
                                        maximumFractionDigits: 2,
                                    })}
                            </td>
                            <td class="text-center">
                                {vrp
                                    .calculateDistance(route)
                                    .toLocaleString("en", {
                                        useGrouping: true,
                                        maximumFractionDigits: 2,
                                        minimumFractionDigits: 2,
                                    })}
                            </td>
                        </tr>
                    {/each}
                    <tr>
                        <td>Total</td>
                        <td></td>
                        <td class="text-center">
                            {demand
                                .reduce((a, b) => a + b, 0)
                                .toLocaleString("en", {
                                    useGrouping: true,
                                })}
                        </td>
                        <td class="text-center">
                            {vrp.calculateTotalDistance().toLocaleString("en", {
                                useGrouping: true,
                                maximumFractionDigits: 2,
                                minimumFractionDigits: 2,
                            })}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
{:else if tab == 1}
    <div class="flex justify-center">
        {@html PlotLocations().outerHTML}
    </div>
    <div class="flex justify-center">
        <table class="table table-xs border-base-content/5 border-2 my-4 w-fit">
            <thead>
                <tr>
                    <th
                        colspan="4"
                        class="text-center font-bold text-lg text-primary"
                    >
                        Demand and Locations
                    </th>
                </tr>
                <tr>
                    <th class="text-center">Demand</th>
                    <th class="w-20 text-center">X</th>
                    <th class="w-20 text-center">Y</th>
                    <th class="w-20 text-center">Action</th>
                </tr>
            </thead>
            <tbody>
                {#each demand as d, i}
                    <tr>
                        <td class="text-center">
                            <label class="input w-28 border-0">
                                <b>d{i}: </b>
                                <input
                                    type="number"
                                    placeholder="Demand {i}"
                                    bind:value={demand[i]}
                                />
                            </label>
                        </td>
                        <td>
                            <label class="input w-28 border-0">
                                <b>x{i}: </b>
                                <input
                                    type="number"
                                    placeholder="X{i}"
                                    class=""
                                    bind:value={locations[i][0]}
                                />
                            </label>
                        </td>
                        <td>
                            <label class="input w-28 border-0">
                                <b>y{i}: </b>
                                <input
                                    type="number"
                                    placeholder="Y{i}"
                                    class=""
                                    bind:value={locations[i][1]}
                                />
                            </label></td
                        >
                        <td class="text-center">
                            <button
                                class="btn btn-square btn-sm btn-error"
                                onclick={() => removeEntry(i)}
                            >
                                X
                            </button>
                        </td>
                    </tr>
                {/each}
                <tr><td colspan="4" class="h-8"></td> </tr>
                <tr>
                    <td class="text-center">
                        <label class="input w-24">
                            <b>d: </b>
                            <input
                                type="number"
                                placeholder="Demand"
                                class=""
                                bind:value={dadd}
                            />
                        </label>
                    </td>
                    <td>
                        <label class="input w-24">
                            <b>x: </b>
                            <input
                                type="number"
                                placeholder="X"
                                class=""
                                bind:value={xadd}
                            />
                        </label>
                    </td>
                    <td>
                        <label class="input w-24">
                            <b>y: </b>
                            <input
                                type="number"
                                placeholder="Y"
                                class=""
                                bind:value={yadd}
                            />
                        </label>
                    </td>
                    <td class="text-center">
                        <button class="btn btn-sm btn-primary" onclick={add}>
                            Add
                        </button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
{:else if tab == 2}
    <div class=" flex">
        <table class="table table-sm border-base-content/5 border-2 my-4 w-fit">
            <thead>
                <tr>
                    <th
                        class="text-center font-bold text-lg text-primary"
                        colspan="7"
                    >
                        Merge Attempts
                    </th>
                </tr>
                <tr>
                    <th class="w-6 text-center">i</th>
                    <th class="w-6 text-center">j</th>
                    <th class="text-center"> Route i </th>
                    <th class="text-center"> Route j </th>
                    <th class="w-20 text-center">Saving</th>
                    <th class="text-center">Feasible</th>
                    <th class="text-center w-52">Reason</th>
                </tr>
            </thead>
            <tbody>
                {#each vrp.MergeAttempts as attempt}
                    <tr class={attempt.feasible ? "bg-accent" : ""}>
                        <td class="font-bold text-center">{attempt.i}</td>
                        <td class="font-bold text-center">{attempt.j}</td>
                        <td class="text-center">
                            {attempt.routeI?.map((node) => node).join("-")}
                        </td>
                        <td class="text-center">
                            {attempt.routeJ?.map((node) => node).join("-")}
                        </td>
                        <td class="font-bold text-center">
                            {attempt.saving?.toLocaleString("en", {
                                useGrouping: true,
                                maximumFractionDigits: 2,
                                minimumFractionDigits: 2,
                            })}
                        </td>
                        <td
                            class="{attempt.feasible
                                ? 'font-bold'
                                : ''} text-center"
                        >
                            {attempt.feasible ? "Yes" : "No"}
                        </td>
                        <td class="text-center"
                            >{ExplainMergeAttempt(attempt)}</td
                        >
                    </tr>
                {/each}
            </tbody>
        </table>
    </div>
{/if}
