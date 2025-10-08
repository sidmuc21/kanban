import { writable, derived } from "svelte/store";

export type Issue = {
  id: string;
  title: string;
  description: string;
  creationDate: string;
  dueDate: string;
  storyPoints: number;
  priority: "Low" | "Medium" | "High";
};

export type Board = {
  "To Do": Issue[];
  "Doing": Issue[];
  "Done": Issue[];
  "Archive": Issue[];
};

const LOCAL_STORAGE_KEY = "kanban-board";

function createBoardStore() {
  let initial: Board = { "To Do": [], "Doing": [], "Done": [], "Archive": [] };

  if (typeof localStorage !== "undefined") {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) initial = JSON.parse(stored);
  }

  const { subscribe, set, update } = writable(initial);

  return {
    subscribe,
    set: (b: Board) => {
      if (typeof localStorage !== "undefined") {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(b));
      }
      set(b);
    },
    update: (fn: (b: Board) => Board) => {
      update(b => {
        const newBoard = fn(b);
        if (typeof localStorage !== "undefined") {
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newBoard));
        }
        return newBoard;
      });
    }
  };
}

export const board = createBoardStore();

export const storyPointsSum = derived(board, $board => {
  const sums: Record<string, number> = {};
  for (const lane in $board) {
    sums[lane] = $board[lane].reduce((acc, issue) => acc + issue.storyPoints, 0);
  }
  return sums;
});
