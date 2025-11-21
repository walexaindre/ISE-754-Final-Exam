<script lang="ts">
    import { VRP } from "./q4";

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

    let vrp: VRP = $state(new VRP(300, 6, locations, demand));
</script>

<div>
    <table class="table table-xs">
        <thead>
            <tr>
                <th>Demand</th>
                <th class="w-20 text-center">X</th>
                <th class="w-20 text-center">Y</th>
                <th class="w-20 text-center">Action</th>
            </tr>
        </thead>
        <tbody>
            {#each demand as d, i}
                <tr>
                    <td class="text-center">
                        <label class="input w-24">
                            <b>d{i}: </b>
                            <input
                                type="number"
                                placeholder="Demand {i}"
                                class=""
                                bind:value={demand[i]}
                            />
                        </label>
                    </td>
                    <td>
                        <label class="input w-24">
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
                        <label class="input w-24">
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
                            class="btn btn-sm btn-error"
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
