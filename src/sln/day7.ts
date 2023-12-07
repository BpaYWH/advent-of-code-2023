import { input } from "../input/d7";

const map: {[card: string]: number} = {
   '2': 2,
   '3': 3,
   '4': 4,
   '5': 5,
   '6': 6,
   '7': 7,
   '8': 8,
   '9': 9,
   'T': 10,
   'J': 11,
   'Q': 12,
   'K': 13,
   'A': 14,
};

const mapB: {[card: string]: number} = {
   'J': 1,
   '2': 2,
   '3': 3,
   '4': 4,
   '5': 5,
   '6': 6,
   '7': 7,
   '8': 8,
   '9': 9,
   'T': 10,
   'Q': 12,
   'K': 13,
   'A': 14,
};

const mapBid = (lines: string[]): string[][] => {
   let res: string[][] = [];

   lines.forEach(line => {
      const [cards, bid] = line.split(' ');
      res.push([cards, bid]);
   });

   return res;
}

const getMap = (cards: string): {[num: number]: number} => {
   const res: {[num: number]: number} = {};

   cards.split('').forEach((card: string) => {
      if (!(map[card] in res)) res[map[card]] = 0;
      res[map[card]]++;
   });

   return res; 
}

const cusSort = (cards: string[][]): void => {
   cards.sort((prev, next) => {
      const prevMap = getMap(prev[0]);
      const nextMap = getMap(next[0]);

      if (Object.keys(prevMap).length < Object.keys(nextMap).length) return 1;
      if (Object.keys(prevMap).length === Object.keys(nextMap).length) {
         // check bigger
         const prevList: [string, number][] = Object.entries(prevMap).sort((a, b) => {
            if (b[1] > a[1]) return 1;
            if (b[1] === a[1]) return parseInt(a[0]) - parseInt(b[0]);
            return -1; 
         });
         const nextList: [string, number][] = Object.entries(nextMap).sort((a, b) => {
            if (b[1] > a[1]) return 1;
            if (b[1] === a[1]) return parseInt(a[0]) - parseInt(b[0]);
            return -1; 
         });

         for (let i = 0; i < prevList.length; i++) {
            if (prevList[i][1] < nextList[i][1]) {
               return -1;
            }
            if (prevList[i][1] > nextList[i][1]) return 1;
         }

         for (let i = 0; i < prev[0].length; i++) {
            if (map[prev[0][i]] < map[next[0][i]]) return -1;
            if (map[prev[0][i]] > map[next[0][i]]) return 1;
         }

         return 0;
      }
      return -1;
   });
}

const calWin = (cards: string[][]): void => {
   let sum = 0;
   for (let i = 0; i < cards.length; i++) {
      sum += parseInt(cards[i][1]) * (i + 1);

   }
   console.log(sum);

}

export const taskA = (): void => {
   const lines = input.split('\n');
   const cards = mapBid(lines);

   cusSort(cards);

   calWin(cards);
}

const getMapB = (cards: string): {[num: number]: number} => {
   const res: {[num: number]: number} = {};

   cards.split('').forEach((card: string) => {
      if (!(mapB[card] in res)) res[mapB[card]] = 0;
      res[mapB[card]]++;
   });
   
   return res; 
}

const getList = (cards: string): [string, number][] => {
   const freqMap = getMapB(cards);
   const hasJ = Object.keys(freqMap).includes("1");
   const list: [string, number][] = Object.entries(freqMap);
   list.sort((a, b) => {
      if (b[1] > a[1]) return 1;
      if (b[1] === a[1]) return parseInt(b[0]) - parseInt(a[0]);
      return -1; 
   });

   // console.log(list);
   if (!hasJ) return list;

   const newList: [string, number][] = [];
   const jFreq = freqMap["1"];
   // console.log('jFreq: ', jFreq);

   list.forEach(item => {
      if (item[0] !== "1") newList.push([...item]);
   });
   if (newList.length) newList[0][1] += jFreq;
   else newList.push(["1", jFreq]);

   // console.log(list,"|||", newList);
   return newList;
}

const cusSortB = (cards: string[][]): void => {
   cards.sort((prev, next) => {
      const prevMap = getList(prev[0]);
      const nextMap = getList(next[0]);

      if (prevMap.length < nextMap.length) return 1;
      if (prevMap.length === nextMap.length) {
         // check bigger
         for (let i = 0; i < prevMap.length; i++) {
            if (prevMap[i][1] < nextMap[i][1]) {
               return -1;
            }
            if (prevMap[i][1] > nextMap[i][1]) return 1;
         }

         for (let i = 0; i < prev[0].length; i++) {
            if (mapB[prev[0][i]] < mapB[next[0][i]]) return -1;
            if (mapB[prev[0][i]] > mapB[next[0][i]]) return 1;
         }

         return 0;
      }
      return -1;
   });
}


export const taskB = (): void => {
   const lines = input.split('\n');
   const cards = mapBid(lines);

   cusSortB(cards);

   calWin(cards);
}