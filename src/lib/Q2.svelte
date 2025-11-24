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
    import { FloydWarshall, type Edge } from "../foundation/floydwarshall";
    import Code from "./Code.svelte";

    import q2 from "./q2?raw";
    import q2nodes from "../assets/q2node.json?raw";
    import q2arcs from "../assets/q2arcs.json?raw";
    import floyd from "../foundation/floydwarshall.ts?raw";

    let codefiles: { filename: string; code: string }[] = [
        {
            filename: "floydwarshall.ts",
            code: floyd,
        },
        {
            filename: "q2.ts",
            code: q2,
        },
        {
            filename: "q2arcs.json",
            code: q2arcs,
        },
        {
            filename: "q2nodes.json",
            code: q2nodes,
        },
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

    function plot() {
        const lines: Plot.Arrow[] = [];
        const edgeText: Plot.Text[] = [];

        const order = (link: NetworkLink): boolean =>
            link.init_node < link.term_node ? true : false;

        for (let lnk of links) {
            const fromNode = nodes.find((nd) => nd.node === lnk.init_node);
            const toNode = nodes.find((nd) => nd.node === lnk.term_node);

            if (fromNode && toNode) {
                const ord = order(lnk);
                const shk = shrink(
                    fromNode.x,
                    fromNode.y,
                    toNode.x,
                    toNode.y,
                    4,
                );

                edgeText.push(
                    Plot.text(
                        [
                            {
                                x: (shk.x1 + shk.x2) / 2 + 2 * shk.ox,
                                y: (shk.y1 + shk.y2) / 2 - 2 * shk.oy,
                                label: lnk.time,
                            },
                        ],
                        {
                            x: "x",
                            y: "y",
                            text: "label",

                            fill: "black",
                            fontSize: 10,
                        },
                    ),
                );

                lines.push(
                    Plot.arrow([shk], {
                        x1: "x1",
                        y1: "y1",
                        x2: "x2",
                        y2: "y2",

                        strokeWidth: 2,
                        stroke: ord ? "blue" : "green",
                    }),
                );
            }
        }

        const plot = Plot.plot({
            width: 600,
            height: 600,
            marks: [
                ...lines,
                ...edgeText,
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

    let NInsertion = $derived(NearestInsertion(startNode, FloydW));

    let nodea = $state(1);
    let nodeb = $state(1);

    let optzstar = $state(685);

    let ZNN = $derived(TotalDistance(NNeighbor, FloydW) / optzstar);
    let ZNI = $derived(TotalDistance(NInsertion, FloydW) / optzstar);

    let NodesCount = $derived(nodes.length);

    let OptimalBoundNN = $derived(
        0.5 * (Math.ceil(Math.log2(nodes.length)) + 1),
    );

    let OptimalBoundNI = $derived(2);

    let BoundFulfilledNN = $derived(ZNN < OptimalBoundNN);
    let BoundFulfilledNI = $derived(ZNI < OptimalBoundNI);

    let tab: number = $state(0);
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
                tab = 2;
            }}
            class="tab {tab == 2 ? 'tab-active' : ''}">Nearest Neighbor</button
        >
        <button
            role="tab"
            onclick={() => {
                tab = 3;
            }}
            class="tab {tab == 3 ? 'tab-active' : ''}">Nearest Insertion</button
        >
        <button
            role="tab"
            onclick={() => {
                tab = 1;
            }}
            class="tab {tab == 1 ? 'tab-active' : ''}"
            >Floyd Warshall Distance Matrix</button
        >
        <button
            role="tab"
            onclick={() => {
                tab = 4;
            }}
            class="tab {tab == 4 ? 'tab-active' : ''}">Code</button
        >
    </div>
</div>

{#if tab == 0}
    <div class=" flex flex-row items-center gap-4 flex-wrap">
        <div>
            <table
                class="table table-md w-full mt-4 border-2 border-base-content/5"
            >
                <thead>
                    <tr>
                        <th
                            class="text-center font-bold text-lg text-primary"
                            colspan="2"
                        >
                            Summary
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td class="font-bold w-32">Number of Nodes</td>
                        <td class="text-center w-80">
                            {nodes.length.toLocaleString("en", {
                                useGrouping: true,
                            })}
                        </td>
                    </tr>
                    <tr>
                        <td class="font-bold">Number of Edges</td>
                        <td class="text-center">
                            {links.length.toLocaleString("en", {
                                useGrouping: true,
                            })}
                        </td>
                    </tr>
                    <tr>
                        <td class="font-bold">Starting Node</td>
                        <td class="text-center">
                            <label class="input w-24">
                                <input
                                    type="number"
                                    placeholder="Start Node"
                                    class="text-center"
                                    min="1"
                                    max={nodes.length}
                                    bind:value={startNode}
                                />
                            </label>
                        </td>
                    </tr>

                    <tr>
                        <td class="font-bold"> NN Route </td>
                        <td class="text-center">{NNeighbor.join("-")}</td>
                    </tr>
                    <tr>
                        <td class="font-bold"> Total NN Distance </td>
                        <td class="text-center">
                            {TotalDistance(NNeighbor, FloydW).toLocaleString(
                                "en",
                                { useGrouping: true },
                            )}
                        </td>
                    </tr>
                    <tr>
                        <td class="font-bold"> NI Route </td>
                        <td class="text-center">{NInsertion.join("-")}</td>
                    </tr>
                    <tr>
                        <td class="font-bold"> Total NI Distance </td>
                        <td class="text-center">
                            {TotalDistance(NInsertion, FloydW).toLocaleString(
                                "en",
                                { useGrouping: true },
                            )}
                        </td>
                    </tr>
                </tbody>
            </table>
            <table
                class="table table-md w-full mt-4 border-2 border-base-content/5"
            >
                <tbody>
                    <tr>
                        <td class="font-bold"> Optimal z* </td>
                        <td colspan="4" class="text-center">
                            <input
                                class="input text-center"
                                type="number"
                                bind:value={optzstar}
                            />
                        </td>
                        <td class="font-bold">Theoretically Bounded</td>
                    </tr>
                    <tr>
                        <td class="font-bold"> Z<sup>NN</sup>/z* </td>
                        <td class="text-center">
                            {(
                                TotalDistance(NNeighbor, FloydW) / optzstar
                            ).toLocaleString("en", { useGrouping: true })}
                        </td><td> {BoundFulfilledNN ? "<" : ">"} </td>
                        <td class="font-bold"> 0.5([log<sub>2</sub> n] +1)</td>

                        <td class="text-center">
                            {(
                                0.5 *
                                (Math.ceil(Math.log2(nodes.length)) + 1)
                            ).toLocaleString("en", { useGrouping: true })}
                        </td>
                        <td class="text-center">
                            {BoundFulfilledNN ? "Yes" : "No"}
                        </td>
                    </tr>

                    <tr>
                        <td class="font-bold"> Z<sup>NI</sup>/z* </td>
                        <td class="text-center">
                            {(
                                TotalDistance(NInsertion, FloydW) / optzstar
                            ).toLocaleString("en", {
                                useGrouping: true,
                            })}
                        </td><td> {BoundFulfilledNI ? "<" : ">"} </td>
                        <td class="font-bold"> 2</td>

                        <td class="text-center"> 2 </td>
                        <td class="text-center">
                            {BoundFulfilledNI ? "Yes" : "No"}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div>
            {@html plot().outerHTML}
        </div>
    </div>
{:else if tab == 1}
    <div class="flex justify-center">
        <table class="table w-80 border-2 border-base-content/5">
            <thead>
                <tr>
                    <th> Node A </th>
                    <th> Node B </th>
                    <th> Shortest Path Distance </th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>
                        <input
                            type="number"
                            bind:value={nodea}
                            class="input input-bordered w-24"
                        />
                    </td>
                    <td>
                        <input
                            type="number"
                            bind:value={nodeb}
                            class="input input-bordered w-24"
                        />
                    </td>
                    <td class="text-center">
                        {FloydW[Nodes.indexOf(nodea)][
                            Nodes.indexOf(nodeb)
                        ].toLocaleString("en", { useGrouping: true })}
                    </td>
                </tr>
            </tbody>
        </table>
    </div>

    <div class="overflow-x-auto py-4">
        <table class="table w-full border-2 border-base-content/5">
            <thead>
                <tr>
                    <th>From - To</th>
                    {#each Nodes as nd}
                        <th>{nd}</th>
                    {/each}
                </tr>
            </thead>
            <tbody>
                {#each FloydW as row, i}
                    <tr>
                        <th>{Nodes[i]}</th>
                        {#each row as val}
                            <td>{val}</td>
                        {/each}
                    </tr>
                {/each}
            </tbody>
        </table>
    </div>
{:else if tab == 2}
    <div class="flex justify-center">
        <table
            class="table table-md w-full mt-4 border-2 border-base-content/5"
        >
            <thead>
                <tr>
                    <th
                        class="text-center font-bold text-lg text-primary"
                        colspan="2"
                    >
                        Summary
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td class="font-bold">Starting Node</td>
                    <td class="text-center">
                        <label class="input w-24">
                            <input
                                type="number"
                                placeholder="Start Node"
                                class="text-center"
                                min="1"
                                max={nodes.length}
                                bind:value={startNode}
                            />
                        </label>
                    </td>
                </tr>
                <tr>
                    <td class="font-bold">Total Distance</td>
                    <td class="text-center">
                        {TotalDistance(NNeighbor, FloydW).toLocaleString("en", {
                            useGrouping: true,
                        })}
                    </td>
                </tr>
                <tr>
                    <td class="font-bold">Tour</td>
                    <td class="text-center">{NNeighbor.join("-")}</td>
                </tr>
            </tbody>
        </table>
    </div>
    <div class="flex justify-center">
        {@html plotTour(NNeighbor).outerHTML}
    </div>
{:else if tab == 3}
    <div class="flex justify-center">
        <table
            class="table table-md w-full mt-4 border-2 border-base-content/5"
        >
            <thead>
                <tr>
                    <th
                        class="text-center font-bold text-lg text-primary"
                        colspan="2"
                    >
                        Summary
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td class="font-bold">Starting Node</td>
                    <td class="text-center">
                        <label class="input w-24">
                            <input
                                type="number"
                                placeholder="Start Node"
                                class="text-center"
                                min="1"
                                max={nodes.length}
                                bind:value={startNode}
                            />
                        </label>
                    </td>
                </tr>
                <tr>
                    <td class="font-bold">Total Distance</td>
                    <td class="text-center">
                        {TotalDistance(NInsertion, FloydW).toLocaleString(
                            "en",
                            {
                                useGrouping: true,
                            },
                        )}
                    </td>
                </tr>
                <tr>
                    <td class="font-bold">Tour</td>
                    <td class="text-center">{NInsertion.join("-")}</td>
                </tr>
            </tbody>
        </table>
    </div>
    <div class="flex justify-center">
        {@html plotTour(NInsertion).outerHTML}
    </div>
{:else if tab == 4}
    <Code data={codefiles} />
{/if}
