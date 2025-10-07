<script lang="ts">
    import IssueCard from "./IssueCard.svelte";
    import type { Issue } from "$lib/stores/boardStore";
    
    export let name: string;
    export let issues: Issue[] = [];
    export let storyPoints: number = 0;
  </script>
  
  <section class="flex flex-col bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200">
    <header class="bg-gray-100 font-lex text-center py-3 font-semibold text-gray-700 border-b border-gray-200">
      {name} ({storyPoints} SP)
    </header>
    <div class="flex-1 p-4 space-y-3 min-h-[100px]">
      {#if issues.length === 0}
        <p class="text-gray-400 text-sm text-center font-lex">No issues yet</p>
      {:else}
        {#each issues as issue (issue.id)}
          <IssueCard {issue} />
        {/each}
      {/if}
    </div>
  </section>
  