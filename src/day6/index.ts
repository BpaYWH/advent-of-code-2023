import { dataA, dataB } from "./data"

const findBeatCount = (time: number, dist: number): number => {
   let count = 0;

   for (let i = 1; i < time; i++) {
      const runTime = time - i;
      const runDist = runTime * i;
      if (runDist > dist) {
         count++;
      }
   }
   return count;
}

export const taskA = (): void => {
   let res = 1;

   dataA.forEach(race => {
      res *= findBeatCount(race[0], race[1]);
   });

   console.log(res);
}

export const taskB = (): void => {
   let res = 0;
   res = findBeatCount(dataB[0], dataB[1]);

   console.log(res);
}