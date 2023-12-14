import { data, example } from "./data";

const rollNorth = (map: string[][]): void => {
   for (let i = 1; i < map.length; i++) {
      for (let j = 0; j < map[i].length; j++) {
         if (map[i][j] === "O") {
            let curr = i - 1;
            while (curr >= 0) {
               if (map[curr][j] === ".") {
                  map[curr][j] = "O";
                  map[curr + 1][j] = ".";
               } else {
                  break;
               }
               curr--;
            }
         }
      }
   }
}

const rollSouth = (map: string[][]): void => {
   for (let i = map.length - 2; i >= 0; i--) {
      for (let j = 0; j < map[i].length; j++) {
         if (map[i][j] === "O") {
            let curr = i + 1;
            while (curr < map.length) {
               if (map[curr][j] === ".") {
                  map[curr][j] = "O";
                  map[curr - 1][j] = ".";
               } else {
                  break;
               }
               curr++;
            }
         }
      }
   }
}

const rollWest = (map: string[][]): void => {
   for (let i = 0; i < map.length; i++) {
      for (let j = 1; j < map[i].length; j++) {
         if (map[i][j] === "O") {
            let curr = j - 1;
            while (curr >= 0) {
               if (map[i][curr] === ".") {
                  map[i][curr] = "O";
                  map[i][curr + 1] = ".";
               } else {
                  break;
               }
               curr--;
            }
         }
      }
   }
}

const rollEast = (map: string[][]): void => {
   for (let i = 0; i < map.length; i++) {
      for (let j = map[i].length - 2; j >= 0; j--) {
         if (map[i][j] === "O") {
            let curr = j + 1;
            while (curr < map[i].length) {
               if (map[i][curr] === ".") {
                  map[i][curr] = "O";
                  map[i][curr - 1] = ".";
               } else {
                  break;
               }
               curr++;
            }
         }
      }
   }
}


export const taskA = (): number => {
   let res = 0;

   const lines = data.split("\n");
   let map = lines.map(l => l.split(""));

   rollNorth(map);

   for (let i = 0; i < map.length; i++) {
      let count = 0;
      for (let j = 0; j < map[i].length; j++) {
         if (map[i][j] === "O") {
            count++;
         }
      }
      res += count * (map.length - i);
   }

   return res;
}

export const taskB = (): number => {
   let res = 0;
   
   const lines = data.split("\n");
   const map = lines.map(l => l.split(""));
   let loop = 1000000000;
   
   const cache = {};
   cache[JSON.stringify(map)] = loop;
   
   let start = 0;
   let end = 0;

   while (loop) {
      rollNorth(map);
      rollWest(map);
      rollSouth(map);
      rollEast(map);

      const newMapKey = JSON.stringify(map);
      if (newMapKey in cache) {
         start = cache[newMapKey];
         end = loop;
         loop--;
         loop %= (end - start);
      } else {
         cache[newMapKey] = loop;
         loop--;
      }
   }

   for (let i = 0; i < map.length; i++) {
      let count = 0;
      for (let j = 0; j < map[i].length; j++) {
         if (map[i][j] === "O") {
            count++;
         }
      }
      res += count * (map.length - i);
   }

   return res;
}
