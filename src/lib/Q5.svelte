<script lang="ts">
    import {
        CummulativeDemand,
        IntegralCummulativeDemand,
        AccessCostInterval,
        OptimalLocation,
        TotalAccessCost,
        TotalAccessCostForLocations,
    } from "./q5";
    import { formatArray } from "../foundation/format";
    import * as Plot from "@observablehq/plot";

    let dist: number = $state(0);
    let dsta: number = $state(0);
    let dstb: number = $state(0);

    let acosta: number = $state(0);
    let acostb: number = $state(0);
    let p: number = $state(0);

    let opta: number = $state(0);
    let optb: number = $state(1500);
    let optn: number = $state(3);

    //<button class="btn btn-active" onclick={plt}> Plt </button>
    //<div id="plot" style="width: 600px; height: 400px;"></div>

    let tab: number = $state(0);

    let locationSet: Array<number> = $state([
        103, 179, 258, 272, 294, 321, 326, 331, 343, 377, 436, 455, 622, 649,
        670, 694, 696, 707, 839, 842, 872, 894, 994, 1044, 1080, 1085, 1153,
        1289, 1382, 1451,
    ]);

    let localAccessCost1 = $derived(
        TotalAccessCostForLocations(0, 1500, 1, locationSet),
    );

    // Calculate the location with minimum cost

    let minCost1 = $derived(
        localAccessCost1.reduce((min, item) =>
            item.cost < min.cost ? item : min,
        ),
    );

    let localAccessCost2 = $derived(
        TotalAccessCostForLocations(0, 1500, 2, locationSet),
    );

    let minCost2 = $derived(
        localAccessCost2.reduce((min, item) =>
            item.cost < min.cost ? item : min,
        ),
    );

    let localAccessCost3 = $derived(
        TotalAccessCostForLocations(0, 1500, 3, locationSet),
    );

    let minCost3 = $derived(
        localAccessCost3.reduce((min, item) =>
            item.cost < min.cost ? item : min,
        ),
    );
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
            class="tab {tab == 1 ? 'tab-active' : ''}">Optimal Location</button
        >
        <button
            role="tab"
            onclick={() => {
                tab = 2;
            }}
            class="tab {tab == 2 ? 'tab-active' : ''}"
            >Location Selection</button
        >

        <button
            role="tab"
            onclick={() => {
                tab = 3;
            }}
            class="tab {tab == 3 ? 'tab-active' : ''}"
            >Optimal Number of Locations</button
        >

        <button
            role="tab"
            onclick={() => {
                tab = 4;
            }}
            class="tab {tab == 4 ? 'tab-active' : ''}"
            >Continuum Aproximation</button
        >
    </div>
</div>

{#if tab == 0}
    <div class="border rounded-box border-base-content/5">
        <table class="table">
            <thead>
                <tr>
                    <th
                        colspan="3"
                        class="text-center font-bold text-lg text-primary"
                    >
                        Calculator
                    </th>
                </tr>
                <tr>
                    <th>Function</th>
                    <th>Parameters</th>
                    <th class="w-60 text-center">Result</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>CummulativeDemand(d)</td>
                    <td>
                        <label class="input w-80">
                            <b>d: </b>
                            <input
                                type="number"
                                placeholder="d"
                                class=""
                                bind:value={dist}
                            />
                        </label>
                    </td>
                    <td class=" text-center"
                        >{CummulativeDemand(dist).toLocaleString("en", {
                            useGrouping: true,
                        })}</td
                    >
                </tr>
                <tr>
                    <td>IntegralCummulativeDemand(a, b)</td>
                    <td>
                        <div class="join w-80">
                            <label class="input join-item">
                                <b>a: </b>
                                <input
                                    type="number"
                                    placeholder="a"
                                    class=""
                                    bind:value={dsta}
                                />
                            </label>
                            <label class="input join-item">
                                <b>b: </b>
                                <input
                                    type="number"
                                    placeholder="b"
                                    class=""
                                    bind:value={dstb}
                                />
                            </label>
                        </div>
                    </td>
                    <td class="text-center"
                        >{IntegralCummulativeDemand(dsta, dstb).toLocaleString(
                            "en",
                            { useGrouping: true },
                        )}</td
                    >
                </tr>
                <tr>
                    <td>AccessCostInterval(a,b,p)</td>
                    <td>
                        <div class="join w-80">
                            <label class="input join-item">
                                <b>a: </b>
                                <input
                                    type="number"
                                    placeholder="a"
                                    class=""
                                    bind:value={acosta}
                                />
                            </label>
                            <label class="input join-item">
                                <b>b: </b>
                                <input
                                    type="number"
                                    placeholder="b"
                                    class=""
                                    bind:value={acostb}
                                />
                            </label>
                            <label class="input join-item">
                                <b>p: </b>
                                <input
                                    type="number"
                                    placeholder="b"
                                    class=""
                                    bind:value={p}
                                />
                            </label>
                        </div>
                    </td>
                    <td class="text-center"
                        >{AccessCostInterval(acosta, acostb, p).toLocaleString(
                            "en",
                            { useGrouping: true },
                        )}</td
                    >
                </tr>
                <tr>
                    <td>OptimalLocation(a,b,n)</td>
                    <td>
                        <div class="join w-80">
                            <label class="input join-item">
                                <b>a: </b>
                                <input
                                    type="number"
                                    placeholder="a"
                                    class=""
                                    bind:value={opta}
                                />
                            </label>
                            <label class="input join-item">
                                <b>b: </b>
                                <input
                                    type="number"
                                    placeholder="b"
                                    class=""
                                    bind:value={optb}
                                />
                            </label>
                            <label class="input join-item">
                                <b>n: </b>
                                <input
                                    type="number"
                                    placeholder="n"
                                    class=""
                                    bind:value={optn}
                                />
                            </label>
                        </div>
                    </td>
                    <td class="text-center"
                        >{formatArray(OptimalLocation(opta, optb, optn))}</td
                    >
                </tr>
            </tbody>
        </table>
    </div>
{:else if tab == 1}
    <div class=" flex justify-center">
        <table class="table border-base-content/5">
            <thead>
                <tr
                    ><th># of locations</th>
                    <th> Optimal locations </th>
                    <th> Total Access Cost </th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>1</td>
                    <td>{formatArray(OptimalLocation(0, 1500, 1))}</td>
                    <td
                        >{TotalAccessCost(0, 1500, 1).toLocaleString("en", {
                            useGrouping: true,
                        })}</td
                    >
                </tr>
                <tr>
                    <td>2</td>
                    <td>{formatArray(OptimalLocation(0, 1500, 2))}</td>
                    <td
                        >{TotalAccessCost(0, 1500, 2).toLocaleString("en", {
                            useGrouping: true,
                        })}</td
                    >
                </tr>
                <tr>
                    <td>3</td>
                    <td>{formatArray(OptimalLocation(0, 1500, 3))}</td>
                    <td
                        >{TotalAccessCost(0, 1500, 3).toLocaleString("en", {
                            useGrouping: true,
                        })}</td
                    >
                </tr>
            </tbody>
        </table>
    </div>
{:else if tab == 2}
    <div class=" flex justify-center">
        <table class="table border-base-content/5">
            <thead>
                <tr>
                    <th> Location </th>
                    <th> Total Access Cost </th>
                    <th> Optimal Access Cost</th>
                    <th> Delta </th>
                    <th> Percentage </th>
                </tr>
            </thead>
            <tbody>
                {#each [minCost1, minCost2, minCost3] as cost, index}
                    <tr>
                        <td>
                            {cost.locations}
                        </td>
                        <td>
                            {cost.cost.toFixed(2)}
                        </td>
                        <td>
                            {cost.optimalCost.toFixed(2)}
                        </td>
                        <td>
                            {cost.delta}
                        </td>
                        <td> {cost.percentage.toFixed(2)}% </td>
                    </tr>
                {/each}
            </tbody>
        </table>
    </div>
{:else if tab == 3}
    <div class=" flex justify-center">
        <table class="table border-base-content/5 w-fit border-2 my-2">
            <thead>
                <tr>
                    <th> Parameter </th>
                    <th> Value </th>
                </tr>
            </thead>
            <tbody>
                <tr class="text-center">
                    <td class="font-bold"> c<sub>T</sub> </td>
                    <td>120000 </td>
                </tr>
                <tr class="text-center">
                    <td class="font-bold"> n<sup>*</sup> </td>
                    <td> - </td>
                </tr>
                <tr class="text-center">
                    <td class="font-bold"> z<sup>*</sup> </td>
                    <td> - </td>
                </tr>
            </tbody>
        </table>
    </div>
    <div class=" flex justify-center">
        <table class="table border-base-content/5">
            <thead>
                <tr>
                    <th> # of Locations </th>
                    <th> Optimal Locations </th>
                    <th> Total Access Cost </th>
                </tr>
            </thead>
            <tbody> </tbody>
        </table>
    </div>
{/if}
