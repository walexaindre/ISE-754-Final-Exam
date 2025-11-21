<script lang="ts">
  import Q4 from "./lib/Q4.svelte";
  import Q5 from "./lib/Q5.svelte";
  let activeQuestion: number = $state(4);
  let totalQuestions: number = 6;

  function setActiveQuestion(q: number) {
    activeQuestion = q;
  }
</script>

<div class="grid justify-center">
  <div role="tablist" class="tabs tabs-lift">
    {#each Array(totalQuestions) as _, index}
      <button
        role="tab"
        class="tab {activeQuestion === index + 1 ? 'tab-active' : ''}"
        onclick={() => setActiveQuestion(index + 1)}
      >
        Q{index + 1}
      </button>
    {/each}
  </div>
  {#if activeQuestion === 4}
    <Q4 />
  {/if}
  {#if activeQuestion === 5}
    <Q5 />
  {/if}
</div>
