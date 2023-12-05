import { input } from "../input/d3";

const Symbols = new Set(
   [
      "*",
      "&",
      "@",
      "/",
      "+",
      "#",
      "$",
      "%",
      "=",
      "-"
   ]);

const directions = [
   [-1, -1],
   [-1, 0],
   [-1, 1],
   [0, -1],
   [0, 1],
   [1, -1],
   [1, 0],
   [1, 1],
];

const extractSymCoords = (lines: string[], syms: Set<string> = Symbols): number[][] => {
   const symIds: number[][] = [];

   lines.forEach((line, row) => {
      line.split("").forEach((c: string, col: number) => {
         if (syms.has(c)) symIds.push([row, col]);
      });
   });

   return symIds;
}

const getInfo = (line: string, row: number, start: number): string => {
   let res = "";
   let left = start;
   let right = start;
   let value = "";

   while (left >= 0 && !isNaN(Number(line[left]))) {
      left--;
   }
   left++;

   while (right < line.length && !isNaN(Number(line[right]))) {
      right++;
   }

   value = line.substring(left, right);
   res = String(row) + "," + String(left) + ":" + value;

   return res;
}

export const taskA = (): void => {
   const set = new Set();
   const lines = input.split("\n");
   const m = lines[0].length;
   const n = lines.length;
   const symCoords = extractSymCoords(lines);
   let sum = 0;

   // add possible parts into set
   for (const [row, col] of symCoords) { 
      if (Symbols.has(lines[row][col])) {
         directions.forEach(([dirR, dirC]) => {
            const newRow = row + dirR;
            const newCol = col + dirC;
            if (newRow >= 0 && newRow < n && newCol >= 0 && newCol < m && !isNaN(parseInt(lines[newRow][newCol]))) {
               const info = getInfo(lines[newRow], newRow, newCol);
               set.add(info);
            } 
         });
      }
   }

   for (const info of set) {
      const [, value] = info.split(":");
      sum += parseInt(value);
   }

   console.log(sum);
}

export const taskB = (): void => {
   const map: Record<string, Set<string>> = {};
   const lines = input.split("\n");
   const m = lines[0].length;
   const n = lines.length;
   const symCoords = extractSymCoords(lines, new Set(["*"]));
   let sum = 0;

   // add possible parts into set
   for (const [row, col] of symCoords) { 
      if (Symbols.has(lines[row][col])) {
         directions.forEach(([dirR, dirC]) => {
            const newRow = row + dirR;
            const newCol = col + dirC;
            if (newRow >= 0 && newRow < n && newCol >= 0 && newCol < m && !isNaN(parseInt(lines[newRow][newCol]))) {
               const info = getInfo(lines[newRow], newRow, newCol);
               const key = `${row},${col}`;
               if (map[key] === undefined) map[key] = new Set();
               map[key].add(info);
            } 
         });
      }
   }

   Object.keys(map).forEach(key => {
      if (map[key].size === 2) {
         let temp = 1;

         for (const info of map[key]) {
            const [, value] = info.split(":");
            temp *= parseInt(value);
         }

         sum += temp;
      }
   });

   console.log(sum);
}