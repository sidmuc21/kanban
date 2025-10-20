<script lang="ts">
  import { board } from "$lib/stores/boardStore";
  export let open = false;
  let dialogEl: HTMLDialogElement;

  let title = "";
  let description = "";
  let dueDate = "";
  let storyPoints = 1;
  let priority: "Low" | "Medium" | "High" = "Medium";

  const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2,5);

  $: if (dialogEl) {
    if (open && !dialogEl.open) dialogEl.showModal();
    if (!open && dialogEl.open) dialogEl.close();
  }

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
    title = description = "";
    dueDate = "";
    storyPoints = 1;
    priority = "Medium";
    open = false;
  };

  const handleClose = () => open = false;

  const handleKeydown = (e: KeyboardEvent) => {
    if(e.key === "Escape") handleClose();
  };
</script>

<dialog bind:this={dialogEl} class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-8 rounded-3xl w-[400px] max-w-[90vw] font-lex shadow-2xl bg-white dark:bg-gray-800" on:keydown={handleKeydown} aria-modal="true">
  <form method="dialog" class="flex flex-col gap-4">
    <h3 class="text-2xl font-semibold text-indigo-900 dark:text-white">Create New Issue</h3>

    <label for="title" class="text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
    <input id="title" type="text" bind:value={title} placeholder="Enter title" required class="border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"/>

    <label for="description" class="text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
    <textarea id="description" bind:value={description} placeholder="Enter description" class="border p-2 rounded-lg h-24 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"></textarea>

    <div class="flex gap-2">
      <div class="flex-1 flex flex-col gap-1">
        <label for="due" class="text-sm font-medium text-gray-700 dark:text-gray-300">Due Date</label>
        <input id="due" type="date" bind:value={dueDate} class="border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"/>
      </div>
      <div class="flex flex-col gap-1 w-20">
        <label for="sp" class="text-sm font-medium text-gray-700 dark:text-gray-300 text-center">SP</label>
        <input id="sp" type="number" min="1" bind:value={storyPoints} class="border p-2 rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"/>
      </div>
    </div>

    <label for="priority" class="text-sm font-medium text-gray-700 dark:text-gray-300">Priority</label>
    <select id="priority" bind:value={priority} class="border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white">
      <option>Low</option>
      <option selected>Medium</option>
      <option>High</option>
    </select>

    <div class="flex justify-end gap-3 mt-4">
      <button type="button" on:click={handleClose} class="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700 transition">Cancel</button>
      <button type="button" on:click={addIssue} class="px-4 py-2 rounded-lg bg-indigo-700 text-white hover:bg-indigo-800 dark:bg-indigo-600 dark:hover:bg-indigo-500 transition">Add Issue</button>
    </div>
  </form>
</dialog>
