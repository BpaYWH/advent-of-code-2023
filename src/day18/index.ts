import { data, example } from "./data";

const direct = {
   "U": [-1, 0],
   "D": [1, 0],
   "L": [0, -1],
   "R": [0, 1]
};

const oppo = {
   "U": "D",
   "D": "U"
}

const findDim = (lines: string[]): [number, number] => {
   let maxU = 0;
   let maxD = 0;
   let maxL = 0;
   let maxR = 0;

   lines.forEach(line => {
      const [dir, dist, color] = line.split(" ");
      if (dir === "U") {
         maxU += parseInt(dist);
      }
      if (dir === "D") {
         maxD += parseInt(dist);
      }
      if (dir === "L") {
         maxL += parseInt(dist);
      }
      if (dir === "R") {
         maxR += parseInt(dist);
      }
   });

   return [maxU + maxD, maxL + maxR];
}

const dig = (map: string[][], command: string, start: number[]): number[] => {
   const [dir, dist, color] = command.split(" ");
   let [r, c] = start;
   const [dr, dc] = direct[dir];

   for (let i = 0; i < parseInt(dist); i++) {
      r = r + dr;
      c = c + dc;

      while (r > map.length - 1) {
         map.push(new Array(map[0].length).fill("."));
      }
      while (c > map[0].length - 1) {
         map.forEach(line => {
            for (let i = 0; i < c - map[0].length + 1; i++) {
               line.push(".");
            }
         });
      }
      map[r][c] = "#";
   }

   return [r, c];
}

const isInside = (map: string[][], start: number[]): boolean => {
   const [r, c] = start;
   if (r <= 0 || r >= map.length - 1 || c <= 0 || c >= map[0].length - 1) {
      return false;
   }

   let prev = "";
   let count = 0;
   for (let i = c - 1; i >= 0; i--) {
      if (map[r][i] === "#") {
         // if extends both
         if (map[r + 1][i] === "#" && map[r - 1][i] === "#") {
            count++;
            continue;
         }
         // extends either
         if (map[r + 1][i] === "#") {
            if (prev === "") {
               prev = "D";
               continue;
            }
            if (prev === oppo["D"]) {
               count++;
            }
            prev = "";
         }

         if (map[r - 1][i] === "#") {
            if (prev === "") {
               prev = "U";
               continue;
            }
            if (prev === oppo["U"]) {
               count++;
            }
            prev = "";
         }
      }
   }

   return count % 2 === 1;
}

const fill = (map: string[][]): string[][] => {
   const filled = new Array(map.length).fill(".").map(() => new Array(map[0].length).fill("."));
   for (let i = 1; i < map.length - 1; i++) {
      for (let j = 1; j < map[i].length - 1; j++) {
         if (map[i][j] === "." && isInside(map, [i, j])) {
            filled[i][j] = "#";
         }
      }
   }

   for (let i = 0; i < map.length; i++) {
      for (let j = 0; j < map[i].length; j++) {
         if (map[i][j] === "#") {
            filled[i][j] = "#";
         }
      }
   }

   return filled;
}

const calFill = (map: string[][]): number => {
   let res = 0;

   map.forEach(line => {
      line.forEach(cell => {
         if (cell === "#") {
            res++;
         }
      });
   });

   return res; 

}

export const taskA = (): number => {
   const lines = data.split("\n");
   const [row, col] = findDim(lines);
   const map = new Array(row).fill(["."]).map(() => new Array(col).fill("."));
   let nextStart = [Math.floor(row / 2), Math.floor(col / 2)];

   lines.forEach(line => {
      nextStart = dig(map, line, nextStart);
   });

   
   const filled = fill(map);

   return calFill(filled);
}


const dirMap = {
   "0": "R",
   "1": "D",
   "2": "L",
   "3": "U"
};

const formNewInst = (line: string) => {
   const len = line.substring(2, line.length - 2);
   const dir = line.charAt(line.length - 2);

   const dist = parseInt(len, 16);

   return [dirMap[dir], dist];
}

const dig2 = (inst): Set<string> => {
   let currR = 0;
   let currC = 0;
   let map: Set<string> = new Set();
   map.add(`${currC},${currR}`);

   for (let i = 0; i < inst.length; i++) {
      const [dir, dist] = inst[i];
      const [dr, dc] = direct[dir];
      currR += dr * dist;
      currC += dc * dist;
      map.add(`${currC},${currR}`);
   }

   return map;
}

export const taskB = (): number => {
   let res = 0;

   const lines = data.split("\n");
   const map = [];
   lines.forEach(line => {
      const [,, color] = line.split(" ");
      map.push(formNewInst(color));
   });

   const strokeSet = dig2(map);
   const strokes = Array.from(strokeSet);

   for (let i = 0; i < strokes.length; i++) {
      const [x1s, y1s] = strokes[i].split(",");
      const [x2s, y2s] = strokes[(i + 1) % strokes.length].split(",");
      const [x1, y1] = [parseInt(x1s), parseInt(y1s)];
      const [x2, y2] = [parseInt(x2s), parseInt(y2s)];
      const area = (x1 - x2) * (y1 + y2) / 2;
      res += area;
      res += (Math.abs(x1 - x2) + Math.abs(y1 - y2)) / 2;
   }

   return Math.abs(res) + 1;
}
