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

  // Export to .ics calendar file
  const exportICS = () => {
    const start = new Date(issue.dueDate).toISOString().replace(/[-:]/g, "").split(".")[0];
    const end = new Date(new Date(issue.dueDate).getTime() + 3600000) // +1h
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

  // Web Share API
  const shareIssue = async () => {
    const text = `Issue: ${issue.title}\nPriority: ${issue.priority}\nDue: ${formatDate(issue.dueDate)}\n${issue.description}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: issue.title, text });
      } catch (err) {
        console.error("Share cancelled or failed:", err);
      }
    } else {
      alert("Sharing is not supported on this device.");
    }
  };
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
  class="bg-white rounded-2xl shadow p-4 border border-gray-200 font-lex hover:shadow-md transition-shadow cursor-grab relative"
  draggable="true"
  on:dragstart={(e) => e.dataTransfer.setData('text/plain', JSON.stringify({ id: issue.id, fromLane: lane }))}
>
  <!-- Top row: title + remove button -->
  <div class="flex justify-between items-start mb-2">
    <div>
      <h3 class="font-semibold text-gray-800">{issue.title}</h3>
      {#if issue.description}
        <p class="text-gray-600 text-sm mt-1">{issue.description}</p>
      {/if}
    </div>
    <button
      on:click={removeIssue}
      class="text-red-500 hover:text-red-700 text-sm font-semibold ml-2"
      title="Remove issue"
    >
      ✕
    </button>
  </div>

  <!-- Bottom section: due date, overdue warning, story points -->
  <div class="flex justify-between items-center mt-3 text-xs text-gray-500">
    <p>
      Due: {issue.dueDate ? formatDate(issue.dueDate) : "—"}
      {#if isOverdue(issue.dueDate)}
        <span class="text-red-500 font-bold ml-1">⚠️</span>
      {/if}
    </p>
    <span class="font-medium text-gray-700">{issue.storyPoints} SP</span>
  </div>

  <!-- Action buttons -->
  <div class="flex gap-2 mt-3 text-sm">
    <button
      on:click={exportICS}
      class="text-indigo-700 border border-indigo-300 px-2 py-1 rounded-lg hover:bg-indigo-100 transition"
    >
      📅 Export
    </button>
    <button
      on:click={shareIssue}
      class="text-indigo-700 border border-indigo-300 px-2 py-1 rounded-lg hover:bg-indigo-100 transition"
    >
      📤 Share
    </button>
  </div>
</div>
