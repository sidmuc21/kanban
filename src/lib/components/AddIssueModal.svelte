<script lang="ts">
  import { board } from "$lib/stores/boardStore";
  export let open = false;

  let title = "";
  let description = "";
  let dueDate = "";
  let storyPoints = 1;
  let priority: "Low" | "Medium" | "High" = "Medium";
  let lane = "To Do";

  const lanes = ["To Do", "Doing", "Done", "Archive"];

  const addIssue = (e: Event) => {
    e.preventDefault();
    const newIssue = {
      id: crypto.randomUUID(),
      title,
      description,
      creationDate: new Date().toISOString(),
      dueDate,
      storyPoints: Number(storyPoints),
      priority
    };
    board.update(b => ({ ...b, [lane]: [...b[lane], newIssue] }));
    // clear & close
    title = ""; description = ""; dueDate = ""; storyPoints = 1; priority = "Medium"; lane = "To Do";
    open = false;
  };
</script>

{#if open}
  <div class="fixed inset-0 z-50 flex items-center justify-center">
    <!-- backdrop -->
    <div class="absolute inset-0 bg-black/50" on:click={() => open = false}></div>

    <!-- modal card -->
    <div class="relative bg-white rounded-2xl shadow-xl p-6 sm:p-8 w-full max-w-md mx-4 font-lex">
      <h3 class="text-xl font-semibold mb-4 text-center text-gray-800">Add New Issue</h3>

      <form on:submit={addIssue} class="space-y-3">
        <input class="w-full border border-gray-300 rounded-xl p-3" bind:value={title} required placeholder="Title" />
        <textarea class="w-full border border-gray-300 rounded-xl p-3" bind:value={description} placeholder="Description" />
        <input class="w-full border border-gray-300 rounded-xl p-3" type="date" bind:value={dueDate} required />

        <div class="flex gap-2">
          <input class="flex-1 border border-gray-300 rounded-xl p-3" type="number" min="0" bind:value={storyPoints} placeholder="Story Points" />
          <select class="flex-1 border border-gray-300 rounded-xl p-3" bind:value={priority}>
            <option>Low</option>
            <option selected>Medium</option>
            <option>High</option>
          </select>
        </div>

        <select class="w-full border border-gray-300 rounded-xl p-3" bind:value={lane}>
          {#each lanes as l}<option>{l}</option>{/each}
        </select>

        <div class="flex justify-end gap-3 mt-4">
          <button type="button" on:click={() => open = false} class="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200">Cancel</button>
          <button type="submit" class="px-4 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700">Add</button>
        </div>
      </form>
    </div>
  </div>
{/if}
