<script lang="ts">
    import codeworker from "../foundation/codehighlight?worker";

    import "../assets/catppucin-latte.css";

    const worker = new codeworker();

    worker.onmessage = (event) => {
        highlightedCode.push(...event.data);
    };

    let { data }: { data: { filename: string; code: string }[] } = $props();
    if (data.length > 0) worker.postMessage(data);

    let activeFileIndex: number = $state(0);

    function setActiveFileIndex(idx: number) {
        activeFileIndex = idx;
    }

    let highlightedCode: string[] = $state([]);
</script>

{#if highlightedCode.length > 0}
    <div class="flex flex-col justify-center items-center w-full">
        <div role="tablist" class="tabs tabs-box">
            {#each data as dt, idx}
                <button
                    onclick={() => setActiveFileIndex(idx)}
                    role="tab"
                    class="tab {idx === activeFileIndex ? 'tab-active ' : ''}"
                >
                    {dt.filename}
                </button>
            {/each}
        </div>

        <div class="text-left mockup-code whitespace-pre my-4 min-w-100">
            {@html highlightedCode[activeFileIndex]}
        </div>
    </div>
{/if}
