<script lang="ts">
    import Lane from "$lib/components/Lane.svelte";
    import { board, storyPointsSum } from "$lib/stores/boardStore";
  </script>
  
  <main class="min-h-screen bg-indigo-900 p-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
    {#each Object.keys($board) as lane}
      <Lane
        name={lane}
        issues={$board[lane]}
        storyPoints={$storyPointsSum[lane] ?? 0}
      />
    {/each}
  </main>
  