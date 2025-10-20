<script lang="ts">
  import { onMount } from "svelte";
  import { writable } from "svelte/store";
  import { board, storyPointsSum } from "$lib/stores/boardStore";
  import AddIssueModal from "$lib/components/AddIssueModal.svelte";
  import IssueCard from "$lib/components/IssueCard.svelte";
  import { exportBoardAsCSV } from "$lib/utils/exportCSV";

  let modalOpen = false;
  const lanes = ["To Do", "Doing", "Done", "Archive"];
  let userCountry = "";

  // Simple dark mode
  const dark = writable(false);

  // Apply background class client-side
  if (typeof window !== "undefined") {
    dark.subscribe((d) => {
      document.body.classList.toggle("bg-gray-900", d);
      document.body.classList.toggle("bg-indigo-100", !d);
    });
  }

  onMount(async () => {
    try {
      const res = await fetch("https://ipapi.co/json/");
      const data = await res.json();
      userCountry = data.country_name || "Unknown";
    } catch {
      userCountry = "Unknown";
    }
  });

  const handleExportCSV = () => exportBoardAsCSV($board);

  const handleDrop = (e: DragEvent, toLane: string) => {
    e.preventDefault();
    const data = e.dataTransfer?.getData("text/plain");
    if (!data) return;

    const { id, fromLane } = JSON.parse(data);
    if (fromLane === toLane) return;

    board.update((b) => {
      const idx = b[fromLane].findIndex((i) => i.id === id);
      if (idx === -1) return b;
      const [moved] = b[fromLane].splice(idx, 1);
      b[toLane].push(moved);

      // Notification for done
      if (toLane === "Done" && "Notification" in window) {
        if (Notification.permission === "granted") {
          new Notification(`Issue "${moved.title}" completed ✅`);
        } else if (Notification.permission !== "denied") {
          Notification.requestPermission().then((p) => {
            if (p === "granted") new Notification(`Issue "${moved.title}" completed ✅`);
          });
        }
      }

      return { ...b };
    });
  };

  const handleDragOver = (e: DragEvent) => e.preventDefault();

  const undo = () => board.undo?.();
  const redo = () => board.redo?.();
</script>

<div class={`flex flex-col min-h-screen transition-colors duration-300 ${$dark ? 'bg-gray-900 text-gray-100' : 'bg-indigo-100 text-gray-800'}`}>
  <!-- Header -->
  <header class={`flex flex-col sm:flex-row justify-between items-center p-6 rounded-b-2xl shadow-md transition-colors duration-300 ${$dark ? 'bg-gray-800' : 'bg-indigo-50'}`}>
    <h1 class="text-4xl font-lex font-bold mb-4 sm:mb-0">Kanban Board</h1>

    <div class="flex gap-3 flex-wrap justify-center sm:justify-start">
      <button
        aria-label="Export all issues as CSV"
        class={`px-4 py-2 rounded-xl shadow font-semibold transition ${$dark ? 'bg-indigo-600 text-white hover:bg-indigo-500' : 'bg-indigo-700 text-white hover:bg-indigo-600'}`}
        on:click={handleExportCSV}
      >
        ⬇ Export CSV
      </button>

      <button
        aria-label="Add a new issue"
        class={`px-4 py-2 rounded-xl shadow font-semibold transition ${$dark ? 'bg-indigo-800 text-white hover:bg-indigo-700' : 'bg-indigo-900 text-white hover:bg-indigo-800'}`}
        on:click={() => (modalOpen = true)}
      >
        + Add Issue
      </button>

      <button
        aria-label="Undo last action"
        class={`px-4 py-2 rounded-xl shadow font-semibold transition ${$dark ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : 'bg-gray-300 text-gray-800 hover:bg-gray-400'}`}
        on:click={undo}
      >
        ⬅ Undo
      </button>

      <button
        aria-label="Redo last undone action"
        class={`px-4 py-2 rounded-xl shadow font-semibold transition ${$dark ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : 'bg-gray-300 text-gray-800 hover:bg-gray-400'}`}
        on:click={redo}
      >
        ➡ Redo
      </button>

      <button
        aria-label="Toggle background color"
        aria-pressed={$dark}
        class={`px-4 py-2 rounded-xl shadow font-semibold transition ${$dark ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : 'bg-gray-300 text-gray-800 hover:bg-gray-400'}`}
        on:click={() => dark.update((d) => !d)}
      >
        Toggle BG
      </button>
    </div>
  </header>

  <!-- Board -->
  <main class="flex-1 p-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
    {#each lanes as lane}
      <!-- svelte-ignore a11y_no_redundant_roles -->
      <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
      <section
        role="region"
        aria-labelledby={`lane-${lane}`}
        class={`flex flex-col rounded-2xl shadow-md hover:shadow-xl transition-shadow overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500 ${$dark ? 'bg-gray-800 text-gray-100' : (lane === 'Archive' ? 'bg-yellow-50' : 'bg-white')}`}
        on:drop={(e) => handleDrop(e, lane)}
        on:dragover={handleDragOver}
        tabindex="0"
      >
        <header id={`lane-${lane}`} class={`text-center py-3 font-semibold border-b transition-colors ${$dark ? 'border-gray-700' : 'border-indigo-200'}`}>
          {lane} ({$storyPointsSum[lane] ?? 0} SP)
        </header>
        <div class="p-4 space-y-4 min-h-[140px]">
          {#if !$board[lane] || $board[lane].length === 0}
            <div class={`text-sm text-center italic ${$dark ? 'text-gray-400' : 'text-gray-500'}`}>No issues yet</div>
          {:else}
            {#each $board[lane] as issue (issue.id)}
              <IssueCard {issue} lane={lane} />
            {/each}
          {/if}
        </div>
      </section>
    {/each}
  </main>

  <!-- Footer -->
  <footer class={`p-4 text-center text-sm border-t transition-colors ${$dark ? 'bg-gray-800 border-gray-700 text-gray-300' : 'bg-indigo-50 border-indigo-200 text-gray-600'}`}>
    🌍 Your country: <span class="font-semibold">{userCountry}</span>
  </footer>
</div>

<AddIssueModal bind:open={modalOpen} />
