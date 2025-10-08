<script lang="ts">
  import type { Issue } from "$lib/stores/boardStore";
  import { board } from "$lib/stores/boardStore";
  export let issue: Issue;
  export let lane: string;

  const formatDate = (d: string) => d ? new Date(d).toLocaleDateString() : "—";
  const isOverdue = (d: string) => d && new Date() > new Date(d);

  const remove = () => {
    board.update(b => {
      b[lane] = b[lane].filter(i => i.id !== issue.id);
      return b;
    });
  };
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
  class="bg-white rounded-2xl shadow p-4 border border-gray-200 font-lex hover:shadow-md transition-shadow cursor-grab relative"
  draggable="true"
  on:dragstart={(e) => e.dataTransfer.setData("text/plain", JSON.stringify({ id: issue.id, fromLane: lane }))}
>
  <button
    class="absolute top-2 right-2 text-red-500 font-bold"
    on:click|stopPropagation={remove}
  >X</button>

  <div class="flex flex-col gap-1">
    <h3 class="font-semibold text-gray-800">{issue.title}</h3>
    {#if issue.description}
      <p class="text-gray-600 text-sm">{issue.description}</p>
    {/if}
  </div>

  <p class="text-xs text-gray-400 mt-2">
    Due: {formatDate(issue.dueDate)}
    {#if isOverdue(issue.dueDate)}
      <span class="text-red-500 font-bold ml-1">⚠️ Overdue</span>
    {/if}
  </p>

  <span class="block text-sm font-medium text-gray-500 mt-2 text-right">
    {issue.storyPoints} SP
  </span>
</div>
