<script lang="ts">
  import type { Issue } from "$lib/stores/boardStore";
  export let issue: Issue;
  export let lane: string; // Needed for drag & drop

  const formatDate = (d: string) => new Date(d).toLocaleDateString();
  const isOverdue = (d: string) => d && new Date() > new Date(d);
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
  class="bg-white rounded-2xl shadow p-4 border border-gray-200 font-lex hover:shadow-md transition-shadow cursor-grab"
  draggable="true"
  on:dragstart={(e) => e.dataTransfer.setData("text/plain", JSON.stringify({ id: issue.id, fromLane: lane }))}
>
  <div class="flex justify-between items-start gap-2 mb-2">
    <div>
      <h3 class="font-semibold text-gray-800">{issue.title}</h3>
      {#if issue.description}
        <p class="text-gray-600 text-sm mt-1">{issue.description}</p>
      {/if}
    </div>
    <span class="text-sm font-medium text-gray-500">{issue.storyPoints} SP</span>
  </div>
  <p class="text-xs text-gray-400">
    Due: {issue.dueDate ? formatDate(issue.dueDate) : "—"}
    {#if isOverdue(issue.dueDate)}
      <span class="text-red-500 font-bold ml-1">⚠️ Overdue</span>
    {/if}
  </p>
</div>
