<script lang="ts">
  import { board } from "$lib/stores/boardStore";
  export let open = false;
  let dialogEl: HTMLDialogElement;

  let title = "";
  let description = "";
  let dueDate = "";
  let storyPoints = 1;
  let priority: "Low" | "Medium" | "High" = "Medium";

  const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2, 5);

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

  const handleClose = () => (open = false);
</script>

<dialog
  bind:this={dialogEl}
  class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-8 rounded-3xl w-[400px] max-w-[90vw] font-lex shadow-2xl bg-white"
>
  <form method="dialog" class="flex flex-col gap-4">
    <h3 class="text-2xl font-semibold text-indigo-900">Create New Issue</h3>

    <div class="flex flex-col gap-1">
      <label class="text-sm font-medium text-gray-700">Title</label>
      <input
        type="text"
        placeholder="Enter title"
        bind:value={title}
        required
        class="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
    </div>

    <div class="flex flex-col gap-1">
      <label class="text-sm font-medium text-gray-700">Description</label>
      <textarea
        placeholder="Enter description"
        bind:value={description}
        class="border border-gray-300 rounded-lg p-2 h-24 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
      ></textarea>
    </div>

    <div class="flex gap-2">
      <div class="flex-1 flex flex-col gap-1">
        <label class="text-sm font-medium text-gray-700">Due Date</label>
        <input
          type="date"
          bind:value={dueDate}
          class="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div class="flex flex-col gap-1 w-20">
        <label class="text-sm font-medium text-gray-700 text-center">SP</label>
        <input
          type="number"
          min="1"
          bind:value={storyPoints}
          class="border border-gray-300 rounded-lg p-2 text-center focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>
    </div>

    <div class="flex flex-col gap-1">
      <label class="text-sm font-medium text-gray-700">Priority</label>
      <select
        bind:value={priority}
        class="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        <option>Low</option>
        <option selected>Medium</option>
        <option>High</option>
      </select>
    </div>

    <div class="flex justify-end gap-3 mt-4">
      <button
        type="button"
        on:click={handleClose}
        class="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition"
      >
        Cancel
      </button>
      <button
        type="button"
        on:click={addIssue}
        class="px-4 py-2 rounded-lg bg-indigo-700 text-white hover:bg-indigo-800 transition"
      >
        Add Issue
      </button>
    </div>
  </form>
</dialog>
