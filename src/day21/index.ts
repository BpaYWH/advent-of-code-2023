import { data, example } from "./data";

const direct = [
   [0, 1],
   [1, 0],
   [0, -1],
   [-1, 0]
];

const findStart = (map: string[][]): number[] => {
   for (let i = 0; i < map.length; i++) {
      for (let j = 0; j < map[i].length; j++) {
         if (map[i][j] === "S") {
            return [i, j];
         }
      }
   }

   return [-1, -1];
}

const move = (map: string[][], possibles: Set<string>): Set<string> => {
   const nexts = new Set<string>();

   for (const possible of possibles) {
      const [rs, cs] = possible.split(",");
      const r = parseInt(rs);
      const c = parseInt(cs);

      for (const [dr, dc] of direct) {
         const nr = r + dr;
         const nc = c + dc;

         if (!(nr < 0 || nc < 0 || nr >= map.length || nc >= map[0].length) && map[nr][nc] !== "#") {
            nexts.add(`${nr},${nc}`);
         }
      }
   }

   return nexts;
}

export const taskA = (): number => {
   let res = 0;

   let steps = 64;
   const lines = data.split("\n");
   const map = lines.map(line => line.split(""));
   const [sr, sc] = findStart(map);
   let possibles = new Set<string>();
   possibles.add(`${sr},${sc}`);

   while (steps) {
      possibles = move(map, possibles);

      steps--;
   }

   return possibles.size;
}

export const taskB = (): number => {


   return 0;
}
