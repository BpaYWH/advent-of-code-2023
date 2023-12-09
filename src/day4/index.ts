import { input } from "./data";

// Card 151: 86 73  7 35 71 23 61  4 47 15 |  2  5  4 34 29 71 12 31 81 36 80 35 27 23  8 42 88 47 52 99  7 67 61 91 16
const getPoints = (line: string): number => {
   let match = 0;

   const [, lists] = line.split(":");
   const [wins, hands] = lists.split("|");

   const strWins = wins.split(" ");
   const strHands = hands.split(" ");
   const winSet = new Set()
   const handSet = new Set();

   strWins.forEach(ele => {
      const num = parseInt(ele.trim());
      if (!isNaN(num)) {
         winSet.add(num);
      }
   });

   strHands.forEach(ele => {
      const num = parseInt(ele.trim());
      if (!isNaN(num)) {
         handSet.add(num);
      }
   })

   for (const num of handSet) {
      if (winSet.has(num)) {
         match++;
      }
   }

   if (match === 0) return 0;

   return 2 ** (match - 1);
}

export const taskA = (): void => {
   let sum = 0;
   const lines = input.split("\n");
   lines.forEach(line => {
      sum += getPoints(line);
   });

   console.log(sum);
}

const getMatchCount = (lists: string): number => {
   let match = 0;

   const [wins, hands] = lists.split("|");
   const strWins = wins.split(" ");
   const strHands = hands.split(" ");
   const winSet = new Set()
   const handSet = new Set();

   strWins.forEach(ele => {
      const num = parseInt(ele.trim());
      if (!isNaN(num)) {
         winSet.add(num);
      }
   });

   strHands.forEach(ele => {
      const num = parseInt(ele.trim());
      if (!isNaN(num)) {
         handSet.add(num);
      }
   })

   for (const num of handSet) {
      if (winSet.has(num)) {
         match++;
      }
   }

   return match;
}

export const taskB = (): void => {
   let sum = 0;
   const lines = input.split("\n");
   const origCount = lines.length;

   const map: Record<number, number> = {};
   for (let i = 0; i < origCount; i++) {
      map[i + 1] = 1;
   }

   lines.forEach(line => {
      const [card, lists] = line.split(":");
      const cardSplit = card.split(" ");
      const id = cardSplit[cardSplit.length - 1];
      const count = getMatchCount(lists);

      for (let i = 0; i < count; i++) {
         map[parseInt(id) + i + 1] += map[parseInt(id)];
      }
   });

   for (const [, value] of Object.entries(map)) {
      sum += value;
   }

   console.log(sum);
}