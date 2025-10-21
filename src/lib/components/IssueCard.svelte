<script lang="ts">
  import { board } from "$lib/stores/boardStore";
  export let issue;
  export let lane: string;

  const formatDate = (d: string) => new Date(d).toLocaleDateString();
  const isOverdue = (d: string) => d && new Date() > new Date(d);

  const removeIssue = () => {
    board.update(b => {
      b[lane] = b[lane].filter(i => i.id !== issue.id);
      return b;
    });
  };

  const exportICS = () => {
    const start = new Date(issue.dueDate).toISOString().replace(/[-:]/g, "").split(".")[0];
    const end = new Date(new Date(issue.dueDate).getTime() + 3600000)
      .toISOString()
      .replace(/[-:]/g, "")
      .split(".")[0];

    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
SUMMARY:${issue.title}
DESCRIPTION:${issue.description}
DTSTART:${start}Z
DTEND:${end}Z
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: "text/calendar" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${issue.title}.ics`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const shareIssue = async () => {
    const text = `Issue: ${issue.title}\nPriority: ${issue.priority}\nDue: ${formatDate(issue.dueDate)}\n${issue.description}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: issue.title, text });
      } catch (err) {
        console.error("Share cancelled or failed:", err);
      }
    } else {
      alert("Sharing not supported on this device.");
    }
  };
</script>

<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
  class="bg-white dark:bg-gray-800 rounded-2xl shadow p-4 border border-gray-200 dark:border-gray-700 font-lex hover:shadow-md transition-shadow cursor-grab relative focus:outline-none focus:ring-2 focus:ring-indigo-500"
  draggable="true"
  tabindex="0"
  aria-label={`Issue: ${issue.title}, ${issue.storyPoints} SP, due ${issue.dueDate}`}
  on:dragstart={(e) => e.dataTransfer.setData('text/plain', JSON.stringify({ id: issue.id, fromLane: lane }))}
>
  <div class="flex justify-between items-start mb-2">
    <div>
      <h3 class="font-semibold text-gray-800 dark:text-gray-200">{issue.title}</h3>
      {#if issue.description}
        <p class="text-gray-600 dark:text-gray-300 text-sm mt-1">{issue.description}</p>
      {/if}
    </div>
    <button
      on:click={removeIssue}
      class="text-red-500 hover:text-red-700 text-sm font-semibold ml-2"
      aria-label="Remove issue"
    >
      ✕
    </button>
  </div>

  <div class="flex justify-between items-center mt-3 text-xs text-gray-500 dark:text-gray-400">
    <p>
      Due: {issue.dueDate ? formatDate(issue.dueDate) : "—"}
      {#if isOverdue(issue.dueDate)}
        <span class="text-red-500 font-bold ml-1">⚠️</span>
      {/if}
    </p>
    <span class="font-medium text-gray-700 dark:text-gray-200">{issue.storyPoints} SP</span>
  </div>

  <div class="flex gap-2 mt-3 text-sm">
    <button
      on:click={exportICS}
      class="text-indigo-700 dark:text-indigo-400 border border-indigo-300 dark:border-indigo-600 px-2 py-1 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900 transition"
      aria-label="Export issue to calendar"
    >
      Export
    </button>
    <button
      on:click={shareIssue}
      class="text-indigo-700 dark:text-indigo-400 border border-indigo-300 dark:border-indigo-600 px-2 py-1 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900 transition"
      aria-label="Share issue"
    >
     Share
    </button>
  </div>
</div>
