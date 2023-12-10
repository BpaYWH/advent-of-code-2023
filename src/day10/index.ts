import { data } from "./data";

const directs = {
   "-": [[0, -1], [0, 1]],
   "|": [[-1, 0], [1, 0]],
   "F": [[1, 0], [0, 1]],
   "L": [[-1, 0], [0, 1]],
   "J": [[-1, 0], [0, -1]],
   "7": [[1, 0], [0, -1]],
   ".": [],
   "S": [],
};

const formGraph = () => {
   const graph = [];

   const lines = data.split("\n");

   lines.forEach(line => {
      graph.push(line.split(""));
   });

   return graph
}

const findStart = (maze: string[][]): [number, number] => {
   for (let r = 0; r < maze.length; r++) {
      for (let c = 0; c < maze[0].length; c++) {
         if (maze[r][c] === "S") {
            return [r, c];
         }
      }
   }
   return [-1, -1];
}

const findOriginal = (maze: string[][], r: number, c: number): string => {
   const connected = {
      up: new Set<string>(["|", "F", "7"]),
      down: new Set<string>(["|", "J", "L"]),
      left: new Set<string>(["-", "L", "F"]),
      right: new Set<string>(["-", "7", "J"]),
   }
   let [up, down, left, right] = [false, false, false, false];

   if (r - 1 >= 0 && maze[r - 1][c] && connected.up.has(maze[r - 1][c])) {
      up = true;
   }
   if (r + 1 < maze.length && maze[r + 1][c] && connected.down.has(maze[r + 1][c])) {
      down = true;
   }
   if (c - 1 >= 0 && maze[r][c - 1] && connected.left.has(maze[r][c - 1])) {
      left = true;
   }
   if (c + 1 < maze[0].length && maze[r][c + 1] && connected.right.has(maze[r][c + 1])) {
      right = true;
   }

   if (up) {
      if (down) {
         return "|";
      }
      if (left) {
         return "J";
      }
      if (right) {
         return "L"
      }
   }

   if (down) {
      if (left) {
         return "7";
      }
      if (right) {
         return "F"
      }
   }

   if (left) {
      if (right) {
         return "-";
      }
   }
   return ".";
}

export const taskA = (): number => {
   let res = 0;
   const visited = new Set<string>();
   const maze = formGraph();

   const [startR, startC] = findStart(maze);
   maze[startR][startC] = findOriginal(maze, startR, startC);

   const q = [[startR, startC]];
   while (q.length > 0) {
      let count = q.length;
      if (count > 4)
         console.log(count)
      while (count) {
         let [r, c] = q.shift();
         const key = `${r},${c}`

         visited.add(key);

         for (let [dr, dc] of directs[maze[r][c]]) {
            const newR = r + dr;
            const newC = c + dc;
            const newKey = `${newR},${newC}`;
            if (newR >= 0 && newR < maze.length && newC >= 0 && newC < maze[0].length && !visited.has(newKey)) {
               q.push([newR, newC]);
            }
         }

         count--;
      }
      res++;
   }

   return res - 1;
}

const isInside = (maze: string[][], r: number, c: number, visited: Set<string>): boolean => {
   const key = `${r},${c}`;
   if (visited.has(key)) {
      return false;
   }

   let up = 0;
   const corner = new Set<string>(["F", "J", "7", "L"]);
   const twistMap = {
      "F": "J",
      "J": "F",
      "7": "L",
      "L": "7"
   };

   let prev = "";
   for (let i = 0; i < r; i++) {
      if (visited.has(`${i},${c}`)) {
         if (maze[i][c] == "-") {
            up++;
         }
         if (corner.has(maze[i][c])) {
            if (prev === "") {
               prev = maze[i][c];
            } else {
               if (twistMap[maze[i][c]] === prev) {
                  up++;
               }
               prev = "";
            }
         }
      }
   }

   return up % 2 === 1;
}

const traverse = (maze: string[][], startR: number, startC: number): Set<string> => {
   const visited = new Set<string>();
   const q = [[startR, startC]];
   const row = maze.length;
   const col = maze[0].length;

   while (q.length > 0) {
      let count = q.length;

      while (count) {
         let [r, c] = q.shift();
         const key = `${r},${c}`

         visited.add(key);

         for (let [dr, dc] of directs[maze[r][c]]) {
            const newR = r + dr;
            const newC = c + dc;
            const newKey = `${newR},${newC}`;
            if (newR >= 0 && newR < row && newC >= 0 && newC < col && !visited.has(newKey)) {
               q.push([newR, newC]);
            }
         }

         count--;
      }
   }

   return visited;
}

export const taskB = (): number => {
   let res = 0;
   const maze = formGraph();

   const [startR, startC] = findStart(maze);
   maze[startR][startC] = findOriginal(maze, startR, startC);

   const visited = traverse(maze, startR, startC);

   for (let i = 0; i < maze.length; i++) {
      for (let j = 0; j < maze[0].length; j++) {
         if (isInside(maze, i, j, visited)) {
            res++;
         }
      }
   }

   return res;
}
