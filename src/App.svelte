<script lang="ts">
  import Q5 from "./lib/Q5.svelte";
</script>

<div class="grid justify-center">
  <div role="tablist" class="tabs tabs-lift">
    <button role="tab" class="tab">Q1</button>
    <button role="tab" class="tab">Q2</button>
    <button role="tab" class="tab">Q3</button>
    <button role="tab" class="tab tab-active">Q4</button>
    <button role="tab" class="tab">Q5</button>
    <button role="tab" class="tab">Q6</button>
  </div>
  <Q5 />
</div>
