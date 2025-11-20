<script lang="ts">
    import {
        CummulativeDemand,
        IntegralCummulativeDemand,
        AccessCostInterval,
    } from "./q5";
    import * as Plot from "@observablehq/plot";

    function plt() {
        const data = Array.from({ length: 100 }, () => ({
            x: Math.random(),
            y: Math.random(),
        }));

        const plot = Plot.plot({
            marks: [Plot.dot(data, { x: "x", y: "y", fill: "blue" })],
            width: 600,
            height: 400,
            x: { label: "X Axis" },
            y: { label: "Y Axis" },
        });

        const plotContainer = document.getElementById("plot");
        if (plotContainer) {
            plotContainer.innerHTML = "";
            plotContainer.appendChild(plot);
        }
    }

    let dist: number = $state(0);
    let dsta: number = $state(0);
    let dstb: number = $state(0);

    let acosta: number = $state(0);
    let acostb: number = $state(0);
    let p: number = $state(0);

    //<button class="btn btn-active" onclick={plt}> Plt </button>
    //<div id="plot" style="width: 600px; height: 400px;"></div>
</script>

<div class="border rounded-box border-base-content/5">
    <table class="table">
        <thead>
            <tr>
                <th
                    colspan="3"
                    class="text-center font-bold text-lg text-primary"
                >
                    Toolkit
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
        </tbody>
    </table>
</div>
