import { data } from "./data";

const map: Record<string, number>  = {
   "L": 0,
   "R": 1
};
const goal = "ZZZ";

const formMap = (nets: string[]): {[curr: string]: string[]} => {
   const res: {[curr: string]: string[]} = {};

   nets.forEach(net => {
      const [curr, next] = net.split("=");
      const temp = next.trim().split(",");
      const nextArr = [temp[0].slice(1).trim(), temp[1].slice(0, -1).trim()];

      res[curr.trim()] = nextArr;
   });


   return res;
}

export const taskA = (): void => {
   let count = 0;
   const lines = data.split("\n");
   const inst = lines[0];
   const nets = lines.slice(1);
   const netMap = formMap(nets);
   let curr = "AAA";

   let i = 0;
   while (curr !== goal) {
      curr = netMap[curr][map[inst[i % inst.length]]];

      count++;
      i++;
   }

   console.log(count);
}

const getStart = (netMap: {[curr: string]: string[]}): string[] => {
   const starts: string[] = [];

   const locs = Object.keys(netMap);
   locs.forEach(loc => {
      if (loc.charAt(2) === 'A') starts.push(loc);
   });

   return starts;
}

const gcd = (a: number, b: number): number => {
   return b === 0 ? a : gcd(b, a % b);
}

const lcm = (a: number, b: number): number => {
   return (a * b) / gcd(a, b);
}

export const taskB = (): void => {
   let count = 0;
   const lines = data.split("\n");
   const inst = lines[0];
   const nets = lines.slice(1);
   const netMap = formMap(nets);
   let curr: string[] = getStart(netMap);

   let i = 0;
   let res: number[] = [];
   curr.forEach(loc => {
      let thisCount = 0;
      let j = 0;
      while (loc.charAt(2) !== 'Z') {
         loc = netMap[loc][map[inst[j % inst.length]]];

         thisCount++;
         j++;
      }
      res.push(thisCount);
   })

   count = 1;
   for (let i = 0; i < res.length; i++) {
      count = lcm(count, res[i]);
   }

   console.log("LCM of", res);
   console.log(count);
}