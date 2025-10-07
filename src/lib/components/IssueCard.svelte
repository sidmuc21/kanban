<script lang="ts">
    import type { Issue } from "$lib/stores/boardStore";
  
    export let issue: Issue;
  
    // Format date to readable string
    const formatDate = (dateStr: string) => {
      const d = new Date(dateStr);
      return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
    };
  
    const isOverdue = (dueStr: string) => {
      return new Date() > new Date(dueStr);
    };
  </script>
  
  <div class="bg-white p-3 rounded-xl shadow border border-gray-200">
    <div class="flex justify-between items-center mb-1">
      <h3 class="font-semibold text-gray-800">{issue.title}</h3>
      <span class="text-sm font-medium text-gray-500">{issue.storyPoints} SP</span>
    </div>
    <p class="text-gray-600 text-sm mb-1">{issue.description}</p>
    <p class="text-xs text-gray-400">
      Due: {formatDate(issue.dueDate)}
      {#if isOverdue(issue.dueDate)}
        <span class="text-red-500 font-bold ml-2">⚠️ Overdue</span>
      {/if}
    </p>
  </div>
  