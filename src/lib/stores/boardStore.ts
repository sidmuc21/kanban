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

  const undoStack: Board[] = [];
  const redoStack: Board[] = [];

  const saveState = (b: Board) => {
    undoStack.push(JSON.parse(JSON.stringify(b)));
    redoStack.length = 0; // clear redo
  };

  return {
    subscribe,
    set: (b: Board) => {
      saveState(b);
      if (typeof localStorage !== "undefined") {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(b));
      }
      set(b);
    },
    update: (fn: (b: Board) => Board) => {
      update(b => {
        const newBoard = fn(b);
        saveState(newBoard);
        if (typeof localStorage !== "undefined") {
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newBoard));
        }
        return newBoard;
      });
    },
    undo: () =>
      update(b => {
        if (undoStack.length === 0) return b;
        const prev = undoStack.pop()!;
        redoStack.push(JSON.parse(JSON.stringify(b)));
        if (typeof localStorage !== "undefined") {
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(prev));
        }
        return prev;
      }),
    redo: () =>
      update(b => {
        if (redoStack.length === 0) return b;
        const next = redoStack.pop()!;
        undoStack.push(JSON.parse(JSON.stringify(b)));
        if (typeof localStorage !== "undefined") {
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(next));
        }
        return next;
      }),
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
