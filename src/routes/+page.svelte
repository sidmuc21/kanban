<script lang="ts">
  import { board, storyPointsSum } from "$lib/stores/boardStore";
  import AddIssueModal from "$lib/components/AddIssueModal.svelte";
  import IssueCard from "$lib/components/IssueCard.svelte";

  let modalOpen = false;
  const lanes = ["To Do", "Doing", "Done", "Archive"];

  const handleDrop = (e: DragEvent, toLane: string) => {
    e.preventDefault();
    const data = e.dataTransfer?.getData("text/plain");
    if (!data) return;

    let parsed;
    try { parsed = JSON.parse(data); } catch { return; }
    const { id, fromLane } = parsed;
    if (fromLane === toLane) return;

    board.update(b => {
      const idx = b[fromLane].findIndex(i => i.id === id);
      if (idx === -1) return b;
      const [moved] = b[fromLane].splice(idx, 1);
      b[toLane].push(moved);
      return { ...b };
    });
  };

  const handleDragOver = (e: DragEvent) => e.preventDefault();
</script>

<header class="flex justify-between items-center p-6">
  <h1 class="text-4xl text-indigo-900 font-lex font-semibold">Kanban Board</h1>

  <button
    class="px-4 py-2 bg-indigo-900 text-white font-lex font-semibold rounded-xl shadow hover:bg-indigo-800 transition-colors"
    on:click={() => modalOpen = true}
  >
    + Add Issue
  </button>
</header>

<main class="min-h-[70vh] bg-indigo-900 p-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
  {#each lanes as lane}
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <section
      class="flex flex-col bg-white rounded-2xl shadow-sm overflow-hidden"
      on:drop={(e) => handleDrop(e, lane)}
      on:dragover={handleDragOver}
    >
      <header class="bg-indigo-100 text-center py-3 font-lex font-semibold border-b border-gray-200">
        {lane} ({$storyPointsSum[lane] ?? 0} SP)
      </header>
      <div class="p-4 space-y-3 min-h-[120px]">
        {#if !$board[lane] || $board[lane].length === 0}
          <div class="text-gray-400 text-sm text-center">No issues yet</div>
        {:else}
          {#each $board[lane] as issue (issue.id)}
            <IssueCard {issue} lane={lane} />
          {/each}
        {/if}
      </div>
    </section>
  {/each}
</main>

<AddIssueModal bind:open={modalOpen} />
