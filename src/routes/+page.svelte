<script lang="ts">
  import { board, storyPointsSum } from "$lib/stores/boardStore";
  import AddIssueModal from "$lib/components/AddIssueModal.svelte";
  import IssueCard from "$lib/components/IssueCard.svelte";
  import { exportBoardAsCSV } from "$lib/utils/exportCSV";
  import { onMount } from "svelte";

  let modalOpen = false;
  const lanes = ["To Do", "Doing", "Done", "Archive"];
  let userCountry = "";

  onMount(async () => {
    try {
      const res = await fetch("https://ipapi.co/json/");
      const data = await res.json();
      userCountry = data.country_name || "Unknown";
    } catch {
      userCountry = "Unknown";
    }
  });

  const handleExportCSV = () => {
    exportBoardAsCSV($board);
  };

  const handleDrop = (e: DragEvent, toLane: string) => {
    e.preventDefault();
    const data = e.dataTransfer?.getData("text/plain");
    if (!data) return;

    const { id, fromLane } = JSON.parse(data);
    if (fromLane === toLane) return;

    board.update(b => {
      const itemIndex = b[fromLane].findIndex(i => i.id === id);
      if (itemIndex === -1) return b;
      const [moved] = b[fromLane].splice(itemIndex, 1);
      b[toLane].push(moved);

      if (toLane === "Done") {
        if ("Notification" in window && Notification.permission === "granted") {
          new Notification(`Issue "${moved.title}" completed ✅`);
        } else if ("Notification" in window && Notification.permission !== "denied") {
          Notification.requestPermission().then(p => {
            if (p === "granted") new Notification(`Issue "${moved.title}" completed ✅`);
          });
        }
      }

      return { ...b };
    });
  };

  const handleDragOver = (e: DragEvent) => e.preventDefault();
</script>

<!-- Root flex container for sticky footer -->
<div class="flex flex-col min-h-screen">
  <header class="flex flex-col sm:flex-row justify-between items-center p-6 bg-indigo-50 rounded-b-2xl shadow-md">
    <h1 class="text-4xl text-indigo-900 font-lex font-bold mb-4 sm:mb-0">Kanban Board</h1>

    <div class="flex gap-3 flex-wrap justify-center sm:justify-start">
      <button
        class="px-4 py-2 bg-indigo-700 text-white font-lex font-semibold rounded-xl shadow hover:bg-indigo-600 transition"
        on:click={handleExportCSV}
      >
        ⬇ Export CSV
      </button>

      <button
        class="px-4 py-2 bg-indigo-900 text-white font-lex font-semibold rounded-xl shadow hover:bg-indigo-800 transition"
        on:click={() => (modalOpen = true)}
      >
        + Add Issue
      </button>
    </div>
  </header>

  <main class="flex-1 p-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 bg-indigo-100">
    {#each lanes as lane}
      <!-- svelte-ignore a11y_no_static_element_interactions -->
      <section
        class="flex flex-col rounded-2xl shadow-md hover:shadow-xl transition-shadow overflow-hidden"
        class:bg-white={lane !== "Archive"}
        class:bg-yellow-50={lane === "Archive"}
        on:drop={(e) => handleDrop(e, lane)}
        on:dragover={handleDragOver}
      >
        <header class="text-center py-3 font-lex font-semibold border-b border-indigo-200">
          {lane} ({$storyPointsSum[lane] ?? 0} SP)
        </header>
        <div class="p-4 space-y-4 min-h-[140px]">
          {#if !$board[lane] || $board[lane].length === 0}
            <div class="text-gray-400 text-sm text-center italic">No issues yet</div>
          {:else}
            {#each $board[lane] as issue (issue.id)}
              <IssueCard {issue} lane={lane} />
            {/each}
          {/if}
        </div>
      </section>
    {/each}
  </main>

  <footer class="p-4 text-center text-gray-600 text-sm bg-indigo-50 border-t border-indigo-200">
    🌍 Your country: <span class="font-semibold">{userCountry}</span>
  </footer>
</div>

<AddIssueModal bind:open={modalOpen} />
