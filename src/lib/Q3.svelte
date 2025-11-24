<script lang="ts">
    import * as Plot from "@observablehq/plot";
    import {
        NearestInsertion,
        NearestNeighbor,
        NetworkDataLinks,
        type NetworkLink,
        type NetworkNode,
        NetworkNodes,
        TotalDistance,
    } from "./q2";

    import { Opt2Exchange, Opt3Exchange } from "./q3";
    import { FloydWarshall, type Edge } from "../foundation/floydwarshall";
    import Code from "./Code.svelte";
    import q3 from "./q3.ts?raw";
    import permutation from "../foundation/permutation.ts?raw";

    let codefiles: { filename: string; code: string }[] = [
        { filename: "permutation.ts", code: permutation },
        { filename: "q3.ts", code: q3 },
    ];

    let links: Array<NetworkLink> = $state([]);
    let nodes: Array<NetworkNode> = $state([]);
    links = NetworkDataLinks;
    nodes = NetworkNodes.map((nd) => ({
        node: nd.node,
        x: nd.x / 10000,
        y: nd.y / 10000,
    }));
    const shrink = (
        x1: number,
        y1: number,
        x2: number,
        y2: number,
        offset: number,
    ): {
        x1: number;
        x2: number;
        y1: number;
        y2: number;
        ox: number;
        oy: number;
    } => {
        let dx = x2 - x1;
        let dy = y2 - y1;

        let ox = 0;
        let oy = 0;
        if (dx == 0) {
            if (dy > 0) ox = -0.5;
            else ox = 0.5;
        }
        if (dy == 0) {
            if (dx > 0) oy = -0.5;
            else oy = 0.5;
        }

        if (dx * dy > 0) {
            ox = (dy / Math.abs(dy)) * 0.5;
        } else if (dx * dy < 0) {
            oy = (dx / Math.abs(dx)) * 0.5;
        }

        const norm = Math.sqrt(dx * dx + dy * dy);

        if (norm === 0) {
            return { x1, y1, x2, y2, ox, oy };
        }
        dx /= norm;
        dy /= norm;

        const mid = {
            x: (x1 + x2) / 2,
            y: (y1 + y2) / 2,
        };

        return {
            x1: mid.x - (dx * (norm - offset)) / 2 + ox,
            y1: mid.y - (dy * (norm - offset)) / 2 - oy,
            x2: mid.x + (dx * (norm - offset)) / 2 + ox,
            y2: mid.y + (dy * (norm - offset)) / 2 - oy,
            ox,
            oy,
        };
    };
    function plotTour(route: Array<number>) {
        const lines: Plot.Arrow[] = [];
        for (let i = 0; i < route.length - 1; i++) {
            const fromNode = nodes.find((nd) => nd.node === route[i]);
            const toNode = nodes.find((nd) => nd.node === route[i + 1]);

            if (fromNode && toNode) {
                const shk = shrink(
                    fromNode.x,
                    fromNode.y,
                    toNode.x,
                    toNode.y,
                    4,
                );

                lines.push(
                    Plot.arrow([shk], {
                        x1: "x1",
                        y1: "y1",
                        x2: "x2",
                        y2: "y2",

                        strokeWidth: 2,
                        stroke: "red",
                    }),
                );
            }
        }

        const plot = Plot.plot({
            width: 600,
            height: 600,
            marks: [
                ...lines,
                Plot.dot(
                    nodes.map((nd) => ({
                        x: nd.x,
                        y: nd.y,
                    })),
                    {
                        x: "x",
                        y: "y",
                        fill: "red",
                        r: 6,
                    },
                ),
                Plot.text(
                    nodes.map((nd) => ({
                        x: nd.x,
                        y: nd.y,
                        label: nd.node,
                    })),
                    {
                        x: "x",
                        y: "y",
                        text: "label",
                        dy: -12,
                        fill: "black",
                        fontSize: 12,
                    },
                ),
            ],
            x: { domain: [0, 50], ticks: 0 },
            y: { domain: [0, 55], ticks: 0 },
        });

        return plot;
    }

    let tab: number = $state(0);

    let Graph: Array<Edge<number>> = $derived(
        links.map((lnk) => ({
            from: lnk.init_node,
            to: lnk.term_node,
            weight: lnk.time,
        })),
    );

    let Nodes: Array<number> = $derived(nodes.map((nd) => nd.node));

    let FloydW: Array<Array<number>> = $derived(FloydWarshall(Nodes, Graph));
    let startNode = $state(1);

    let NNeighbor = $derived(NearestNeighbor(startNode, FloydW));
    let NNeighborTotal = $derived(TotalDistance(NNeighbor, FloydW));
    let NN2Opt = $derived(Opt2Exchange(NNeighbor, FloydW, 3));
    let NN2OptTotal = $derived(TotalDistance(NN2Opt.route, FloydW));
    let NN3Opt = $derived(Opt3Exchange(NNeighbor, FloydW, 3));
    let NN3OptTotal = $derived(TotalDistance(NN3Opt.route, FloydW));

    let NInsertion = $derived(NearestInsertion(startNode, FloydW));
    let NInsertionTotal = $derived(TotalDistance(NInsertion, FloydW));
    let NI2Opt = $derived(Opt2Exchange(NInsertion, FloydW, 3));
    let NI2OptTotal = $derived(TotalDistance(NI2Opt.route, FloydW));
    let NI3Opt = $derived(Opt3Exchange(NInsertion, FloydW, 3));
    let NI3OptTotal = $derived(TotalDistance(NI3Opt.route, FloydW));
</script>

<div class="flex justify-center pb-4">
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
            class="tab {tab == 1 ? 'tab-active' : ''}">2 Opt - NN</button
        >
        <button
            role="tab"
            onclick={() => {
                tab = 2;
            }}
            class="tab {tab == 2 ? 'tab-active' : ''}">2 Opt - NI</button
        >

        <button
            role="tab"
            onclick={() => {
                tab = 3;
            }}
            class="tab {tab == 3 ? 'tab-active' : ''}">3 Opt - NN</button
        >
        <button
            role="tab"
            onclick={() => {
                tab = 4;
            }}
            class="tab {tab == 4 ? 'tab-active' : ''}">3 Opt - NI</button
        >
        <button
            role="tab"
            onclick={() => {
                tab = 5;
            }}
            class="tab {tab == 5 ? 'tab-active' : ''}">Code</button
        >
    </div>
</div>
<div class="flex justify-center">
    <table class="table w-fit mb-4">
        <thead>
            <tr>
                <th
                    colspan="2"
                    class="text-center font-bold text-lg text-primary"
                >
                    Parameters
                </th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>Starting Node:</td>
                <td>
                    <label class="input w-32">
                        <input
                            type="number"
                            placeholder="Start Node"
                            class=""
                            bind:value={startNode}
                        />
                    </label>
                </td>
            </tr>
        </tbody>
    </table>
</div>
{#if tab == 0}
    <div class=" flex justify-center">
        <table class="table w-fit">
            <thead>
                <tr>
                    <th
                        colspan="4"
                        class="text-center font-bold text-lg text-primary"
                    >
                        Summary
                    </th>
                </tr>
                <tr>
                    <th>Method</th>
                    <th class="text-center w-40">Initial</th>
                    <th class="text-center w-40">2 Opt</th>
                    <th class="text-center w-40">3 Opt</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Nearest Neighbor</td>
                    <td class="text-center">
                        {NNeighborTotal.toLocaleString("en", {
                            useGrouping: true,
                        })} (0%)
                    </td>
                    <td class="text-center">
                        {NN2OptTotal.toLocaleString("en", {
                            useGrouping: true,
                        })} ({(
                            ((NNeighborTotal - NN2OptTotal) / NNeighborTotal) *
                            100
                        ).toFixed(2)} %)
                    </td>
                    <td class="text-center">
                        {NN3OptTotal.toLocaleString("en", {
                            useGrouping: true,
                        })} ({(
                            ((NNeighborTotal - NN3OptTotal) / NNeighborTotal) *
                            100
                        ).toFixed(2)} %)
                    </td>
                </tr>
                <tr>
                    <td>Nearest Insertion</td>
                    <td class="text-center">
                        {NInsertionTotal.toLocaleString("en", {
                            useGrouping: true,
                        })} (0 %)
                    </td><td class="text-center">
                        {NI2OptTotal.toLocaleString("en", {
                            useGrouping: true,
                        })} ({(
                            ((NInsertionTotal - NI2OptTotal) /
                                NInsertionTotal) *
                            100
                        ).toFixed(2)} %)
                    </td>
                    <td class="text-center">
                        {NI3OptTotal.toLocaleString("en", {
                            useGrouping: true,
                        })} ({(
                            ((NInsertionTotal - NI3OptTotal) /
                                NInsertionTotal) *
                            100
                        ).toFixed(2)} %)
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
    <div class="grid grid-cols-2 justify-center pt-4 gap-4">
        <div>
            <h3 class="text-center font-bold text-lg text-primary pb-2">
                Nearest Neighbor
            </h3>
            {@html plotTour(NNeighbor).outerHTML}
        </div>
        <div>
            <h3 class="text-center font-bold text-lg text-primary pb-2">
                Nearest Insertion
            </h3>
            {@html plotTour(NInsertion).outerHTML}
        </div>
        <div>
            <h3 class="text-center font-bold text-lg text-primary pb-2">
                Nearest Neighbor + 2 Opt
            </h3>
            {@html plotTour(NN2Opt.route).outerHTML}
        </div>
        <div>
            <h3 class="text-center font-bold text-lg text-primary pb-2">
                Nearest Insertion + 2 Opt
            </h3>
            {@html plotTour(NI2Opt.route).outerHTML}
        </div>
        <div>
            <h3 class="text-center font-bold text-lg text-primary pb-2">
                Nearest Neighbor + 3 Opt
            </h3>
            {@html plotTour(NN3Opt.route).outerHTML}
        </div>
        <div>
            <h3 class="text-center font-bold text-lg text-primary pb-2">
                Nearest Insertion + 3 Opt
            </h3>
            {@html plotTour(NI3Opt.route).outerHTML}
        </div>
    </div>
{:else if tab == 1}
    <div class=" flex justify-center">
        <div>
            {@html plotTour(NN2Opt.route).outerHTML}
        </div>
        <div>
            <table class="table border border-base-content/5 w-fit ml-4">
                <thead>
                    <tr>
                        <th
                            colspan="6"
                            class="text-center font-bold text-lg text-primary"
                        >
                            Nearest Neighbor + 2 Opt
                        </th>
                    </tr>
                    <tr>
                        <th> i </th>
                        <th> j </th>
                        <th> Feasible </th>
                        <th> Current Distance</th>
                        <th> New Distance</th>
                        <th> Delta</th>
                    </tr>
                </thead>
                <tbody>
                    {#each NN2Opt.history.filter((v) => v.feasible) as hist}
                        <tr class={hist.feasible ? "bg-accent" : ""}>
                            <td> {hist.i} </td>
                            <td> {hist.j} </td>
                            <td>
                                {hist.feasible ? "Yes" : "No"}
                            </td>
                            <td>
                                {hist.currentDistance.toLocaleString("en", {
                                    useGrouping: true,
                                })}
                            </td>
                            <td>
                                {hist.newDistance.toLocaleString("en", {
                                    useGrouping: true,
                                })}
                            </td>
                            <td>
                                {hist.delta.toLocaleString("en", {
                                    useGrouping: true,
                                })}
                            </td>
                            <td>
                                {hist.route.join("-")}
                            </td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>
    </div>
{:else if tab == 2}
    <div class=" flex justify-center">
        <div>
            {@html plotTour(NI2Opt.route).outerHTML}
        </div>
        <div>
            <table class="table border border-base-content/5 w-fit ml-4">
                <thead>
                    <tr>
                        <th
                            colspan="6"
                            class="text-center font-bold text-lg text-primary"
                        >
                            Nearest Insertion + 2 Opt
                        </th>
                    </tr>
                    <tr>
                        <th> i </th>
                        <th> j </th>
                        <th> Feasible </th>
                        <th> Current Distance</th>
                        <th> New Distance</th>
                        <th> Delta</th>
                        <th> Route</th>
                    </tr>
                </thead>
                <tbody>
                    {#each NI2Opt.history.filter((v) => v.feasible) as hist}
                        <tr class={hist.feasible ? "bg-accent" : ""}>
                            <td> {hist.i} </td>
                            <td> {hist.j} </td>
                            <td>
                                {hist.feasible ? "Yes" : "No"}
                            </td>
                            <td>
                                {hist.currentDistance.toLocaleString("en", {
                                    useGrouping: true,
                                })}
                            </td>
                            <td>
                                {hist.newDistance.toLocaleString("en", {
                                    useGrouping: true,
                                })}
                            </td>
                            <td>
                                {hist.delta.toLocaleString("en", {
                                    useGrouping: true,
                                })}
                            </td>
                            <td>
                                {hist.route.join("-")}
                            </td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>
    </div>
{:else if tab == 3}
    <div class=" flex justify-center">
        <div>
            {@html plotTour(NN3Opt.route).outerHTML}
        </div>
        <div>
            <table class="table border border-base-content/5 w-fit ml-4">
                <thead>
                    <tr>
                        <th
                            colspan="6"
                            class="text-center font-bold text-lg text-primary"
                        >
                            Nearest Neighbor + 3 Opt
                        </th>
                    </tr>
                    <tr>
                        <th> i </th>
                        <th> j </th>
                        <th> k </th>
                        <th> Feasible </th>
                        <th> Current Distance</th>
                        <th> New Distance</th>
                        <th> Delta</th>
                        <th> Route</th>
                    </tr>
                </thead>
                <tbody>
                    {#each NN3Opt.history.filter((v) => v.feasible) as hist}
                        <tr class={hist.feasible ? "bg-accent" : ""}>
                            <td> {hist.i} </td>
                            <td> {hist.j} </td>
                            <td> {hist.k} </td>
                            <td>
                                {hist.feasible ? "Yes" : "No"}
                            </td>
                            <td>
                                {hist.currentDistance.toLocaleString("en", {
                                    useGrouping: true,
                                })}
                            </td>
                            <td>
                                {hist.newDistance.toLocaleString("en", {
                                    useGrouping: true,
                                })}
                            </td>
                            <td>
                                {hist.delta.toLocaleString("en", {
                                    useGrouping: true,
                                })}
                            </td>
                            <td>
                                {hist.route.join("-")}
                            </td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>
    </div>
{:else if tab == 4}
    <div class=" flex justify-center">
        <div>
            {@html plotTour(NI3Opt.route).outerHTML}
        </div>
        <div>
            <table class="table border border-base-content/5 w-fit ml-4">
                <thead>
                    <tr>
                        <th
                            colspan="6"
                            class="text-center font-bold text-lg text-primary"
                        >
                            Nearest Insertion + 3 Opt
                        </th>
                    </tr>
                    <tr>
                        <th> i </th>
                        <th> j </th>
                        <th> k </th>
                        <th> Feasible </th>
                        <th> Current Distance</th>
                        <th> New Distance</th>
                        <th> Delta</th>
                        <th> Route</th>
                    </tr>
                </thead>
                <tbody>
                    {#each NI3Opt.history.filter((v) => v.feasible) as hist}
                        <tr class={hist.feasible ? "bg-accent" : ""}>
                            <td> {hist.i} </td>
                            <td> {hist.j} </td>
                            <td> {hist.k} </td>
                            <td>
                                {hist.feasible ? "Yes" : "No"}
                            </td>
                            <td>
                                {hist.currentDistance.toLocaleString("en", {
                                    useGrouping: true,
                                })}
                            </td>
                            <td>
                                {hist.newDistance.toLocaleString("en", {
                                    useGrouping: true,
                                })}
                            </td>
                            <td>
                                {hist.delta.toLocaleString("en", {
                                    useGrouping: true,
                                })}
                            </td>
                            <td>
                                {hist.route.join("-")}
                            </td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>
    </div>
{:else if tab == 5}
    <Code data={codefiles} />
{/if}
