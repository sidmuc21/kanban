import type { Board } from "$lib/stores/boardStore";

export function exportBoardAsCSV(board: Board) {
  const headers = ["ID", "Title", "Description", "Creation Date", "Due Date", "Story Points", "Priority", "Lane"];
  const rows: string[] = [];

  for (const lane in board) {
    for (const issue of board[lane]) {
      rows.push([
        issue.id,
        issue.title,
        issue.description,
        issue.creationDate,
        issue.dueDate,
        issue.storyPoints.toString(),
        issue.priority,
        lane
      ].map(v => `"${v?.replace(/"/g, '""')}"`).join(","));
    }
  }

  const csvContent = [headers.join(","), ...rows].join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "kanban_board.csv";
  a.click();
  URL.revokeObjectURL(url);
}
