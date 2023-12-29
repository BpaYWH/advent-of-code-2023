import { data, example, example2 } from "./data";
import Heap from 'heap';

type Step = {
   r: number,
   c: number,
   avail: number,
   loss: number,
   direct: string,
};

const turn = {
   r: ["d", "u"],
   l: ["d", "u"],
   d: ["l", "r"],
   u: ["l", "r"],
};

const direct = {
   r: [0, 1],
   l: [0, -1],
   d: [1, 0],
   u: [-1, 0],
};

const addPQ = (pq: Heap<Step>, r: number, c: number, avail: number, loss: number, nextDirect: string, map: number[][], visited: Set<string>): number => {
   const [dr, dc] = direct[nextDirect];
   const nr = r + dr;
   const nc = c + dc;

   if (nr === map.length - 1 && nc === map[0].length - 1) {
      return loss + map[nr][nc];
   }

   const key = `${nr},${nc},${nextDirect},${avail}`;

   if (nr < 0 || nr >= map.length || nc < 0 || nc >= map[0].length || visited.has(key)) {
      return -1;
   }
   visited.add(key);

   const nLoss = loss + map[nr][nc];

   pq.push({
      r: nr,
      c: nc,
      avail,
      loss: nLoss,
      direct: nextDirect,
   });

   return -1;
}

const dijk = (map: number[][], sr: number, sc: number): number => {
   const visited = new Set<string>();
   
   const firstStepR = {
      r: sr,
      c: sc + 1,
      avail: 2,
      loss: map[sr][sc+1],
      direct: "r",
   };
   const firstStepD = {
      r: sr + 1,
      c: sc,
      avail: 2,
      loss: map[sr+1][sc],
      direct: "d"
   };

   const pq = new Heap<Step>((a, b) => a.loss - b.loss);
   pq.push(firstStepR);
   pq.push(firstStepD);
   visited.add(`${sr},${sc+1},r,2`);
   visited.add(`${sr+1},${sc},d,2`);

   while (!pq.empty()) {
      const curr = pq.pop();

      for (const nextDirect of turn[curr.direct]) {
         const res = addPQ(pq, curr.r, curr.c, 2, curr.loss, nextDirect, map, visited);
         if (res !== -1) {
            return res;
         }
      }

      if (curr.avail > 0) {
         const res = addPQ(pq, curr.r, curr.c, curr.avail - 1, curr.loss, curr.direct, map, visited);
         if (res !== -1) {
            return res;
         }
      }
   }

   return 0;
}

export const taskA = (): number => {
   const mapStr = data.split('\n').map(x => x.split(''));
   const map = new Array(mapStr.length).fill(false).map(() => []);
   for (let i = 0; i < mapStr.length; i++) {
      for (let j = 0; j < mapStr[i].length; j++) {
         map[i].push(parseInt(mapStr[i][j]));
      }
   }

   const [sr, sc] = [0, 0];

   return dijk(map, sr, sc);
}

const addPQ2 = (pq: Heap<Step>, r: number, c: number, avail: number, loss: number, nextDirect: string, map: number[][], visited: Set<string>): number => {
   const [dr, dc] = direct[nextDirect];
   const nr = r + dr;
   const nc = c + dc;

   if (nr === map.length - 1 && nc === map[0].length - 1 && avail >= 4) {
      return loss + map[nr][nc];
   }

   const key = `${nr},${nc},${nextDirect},${avail}`;

   if (nr < 0 || nr >= map.length || nc < 0 || nc >= map[0].length || visited.has(key)) {
      return -1;
   }
   visited.add(key);

   const nLoss = loss + map[nr][nc];

   pq.push({
      r: nr,
      c: nc,
      avail,
      loss: nLoss,
      direct: nextDirect,
   });

   return -1;
}

const dijk2 = (map: number[][], sr: number, sc: number): number => {
   const visited = new Set<string>();
   
   const firstStepR = {
      r: sr,
      c: sc + 1,
      avail: 1,
      loss: map[sr][sc+1],
      direct: "r",
   };
   const firstStepD = {
      r: sr + 1,
      c: sc,
      avail: 1,
      loss: map[sr+1][sc],
      direct: "d"
   };

   const pq = new Heap<Step>((a, b) => a.loss - b.loss);
   pq.push(firstStepR);
   pq.push(firstStepD);
   visited.add(`${sr},${sc+1},r,1`);
   visited.add(`${sr+1},${sc},d,1`);

   while (!pq.empty()) {
      const curr = pq.pop();

      if (curr.avail < 4) {
         const res = addPQ2(pq, curr.r, curr.c, curr.avail + 1, curr.loss, curr.direct, map, visited);
         if (res !== -1) {
            return res;
         }
      } else {
         if (curr.avail < 10) {
            const res = addPQ2(pq, curr.r, curr.c, curr.avail + 1, curr.loss, curr.direct, map, visited);
            if (res !== -1) {
               return res;
            }
         }

         for (const nextDirect of turn[curr.direct]) {
            const res = addPQ2(pq, curr.r, curr.c, 1, curr.loss, nextDirect, map, visited);
            if (res !== -1) {
               return res;
            }
         }
      }
   }

   return 0;
}

export const taskB = (): number => {
   const mapStr = data.split('\n').map(x => x.split(''));
   const map = new Array(mapStr.length).fill(false).map(() => []);
   for (let i = 0; i < mapStr.length; i++) {
      for (let j = 0; j < mapStr[i].length; j++) {
         map[i].push(parseInt(mapStr[i][j]));
      }
   }

   const [sr, sc] = [0, 0];

   return dijk2(map, sr, sc);
}
