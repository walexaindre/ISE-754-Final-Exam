<script lang="ts">
  import Q1 from "./lib/Q1.svelte";
  import Q3 from "./lib/Q3.svelte";
  import Q2 from "./lib/Q2.svelte";
  import Q4 from "./lib/Q4.svelte";
  import Q5 from "./lib/Q5.svelte";
  let activeQuestion: number = $state(3);
  let totalQuestions: number = 6;

  function setActiveQuestion(q: number) {
    activeQuestion = q;
  }
</script>

<div class="flex justify-center">
  <div role="tablist" class="tabs tabs-lift">
    {#each Array(totalQuestions) as _, index}
      <button
        role="tab"
        class="tab {activeQuestion === index + 1
          ? 'tab-active bg-secondary'
          : ''}"
        onclick={() => setActiveQuestion(index + 1)}
      >
        Question {index + 1}
      </button>
    {/each}
  </div>
</div>
<div class="grid justify-center">
  {#if activeQuestion === 1}
    <p>Question 1 content goes here.</p>
  {:else if activeQuestion === 2}
    <Q2 />
  {:else if activeQuestion === 3}
    <Q3 />
  {:else if activeQuestion === 4}
    <Q4 />
  {:else if activeQuestion === 5}
    <Q5 />
  {/if}
</div>
