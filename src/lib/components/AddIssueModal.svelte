<script lang="ts">
  import { board } from "$lib/stores/boardStore";
  export let open = false;

  let title = "";
  let description = "";
  let dueDate = "";
  let storyPoints = 1;
  let priority: "Low" | "Medium" | "High" = "Medium";

  // Simple ID generator
  const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2, 5);

  const addIssue = () => {
    if (!title) return;

    board.update(b => {
      b["To Do"].push({
        id: generateId(),
        title,
        description,
        creationDate: new Date().toISOString(),
        dueDate,
        storyPoints,
        priority
      });
      return b;
    });

    // Reset form
    title = description = "";
    dueDate = "";
    storyPoints = 1;
    priority = "Medium";
    open = false;
  };
</script>

<dialog class="p-4 flex flex-col gap-2 w-80" open={open}>
  <form method="dialog" class="flex flex-col gap-2">
    <h3 class="font-semibold text-lg">New Issue</h3>
    <input type="text" placeholder="Title" bind:value={title} required class="border p-1 rounded"/>
    <textarea placeholder="Description" bind:value={description} class="border p-1 rounded"/>
    <input type="date" bind:value={dueDate} class="border p-1 rounded"/>
    <input type="number" min="1" bind:value={storyPoints} class="border p-1 rounded"/>
    <select bind:value={priority} class="border p-1 rounded">
      <option>Low</option>
      <option selected>Medium</option>
      <option>High</option>
    </select>
    <div class="flex justify-end gap-2 mt-2">
      <button type="button" on:click={() => open = false}>Cancel</button>
      <button type="button" on:click={addIssue} class="bg-indigo-700 text-white px-2 rounded">Add</button>
    </div>
  </form>
</dialog>
