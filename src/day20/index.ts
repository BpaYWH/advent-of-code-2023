import { data, example1, example2 } from "./data";

type Conjunction = {
   [name: string]: {
      src: {
         [srcName: string]: boolean,
      },
      dest: string[],
   }
};
type FilpFlop = {
   [name: string]: {
      dest: string[],
      state: boolean
   }
}
type Signal = [string, string, boolean];

const scanModules = (modules: string[]): [FilpFlop, Conjunction] => {
   const ffs: FilpFlop = {};
   const cjs: Conjunction = {};

   for (const module of modules) {
      let [serialName, destStr] = module.split(" -> ");
      const dests = destStr.split(", ");

      if (serialName === "broadcaster") {
         if (!(serialName in ffs)) {
            ffs[serialName] = { dest: [], state: false };
         }

         // add dest
         if (dests.length === 0) {
            ffs[serialName].dest.push(destStr);
         } else {
            for (const dest of dests) {
               ffs[serialName].dest.push(dest);
            }
         }
      }

      // ff
      if (serialName.includes("%")) {
         serialName = serialName.replace("%", "");
         if (!(serialName in ffs)) {
            ffs[serialName] = { dest: [], state: false };
         }

         // add dest
         if (dests.length === 0) {
            ffs[serialName].dest.push(destStr);
         } else {
            for (const dest of dests) {
               ffs[serialName].dest.push(dest);
            }
         }
      }

      // conj
      if (serialName.includes("&")) {
         serialName = serialName.replace("&", "");
         if (!(serialName in cjs)) {
            cjs[serialName] = { src: {}, dest: []};
         }
         if (dests.length === 0) {
            cjs[serialName].dest.push(destStr);
         } else {
            for (const dest of dests) {
               cjs[serialName].dest.push(dest);
            }
         }
      }
   }

   // gather conj srcs
   for (const module of modules) {
      let [serialName, destStr] = module.split(" -> ");
      if (serialName === "broadcaster") {
         continue;
      }

      serialName = serialName.slice(1);
      const dests = destStr.split(", ");

      if (dests.length === 0) {
         if (!(destStr in cjs)) {
            continue;
         }
         cjs[destStr].src[serialName] = false;
      } else {
         for (const dest of dests) {
            if (dest in cjs) {
               cjs[dest].src[serialName] = false;
            }
         }
      }
   }

   return [ffs, cjs];
}

const transmit = (ffs: FilpFlop, cjs: Conjunction): number[] => {
   let low = 1;
   let high = 0;
   const q: Signal[] = [];
   for (const dest of ffs["broadcaster"].dest) {
      q.push(["broadcaster", dest, false]);
      low++;
   }

   while (q.length) {
      let count = q.length;
      while (count) {
         const [input, module, currSignal] = q.shift();
         if (module in ffs) {
            if (!currSignal) {
               const nextSignal = !ffs[module].state;
               ffs[module].state = !ffs[module].state;

               for (const dest of ffs[module].dest) {
                  q.push([module, dest, nextSignal]);
                  if (nextSignal) {
                     high++;
                  } else {
                     low++;
                  }
               }
            }
         }

         if (module in cjs) {
            cjs[module].src[input] = currSignal;
            let nextSignal = false;

            for (const srcName in cjs[module].src) {
               if (!cjs[module].src[srcName]) {
                  nextSignal = true;
                  break;
               }
            }

            for (const dest of cjs[module].dest) {
               q.push([module, dest, nextSignal]);
               if (nextSignal) {
                  high++;
               } else {
                  low++;
               }
            }
         }

         count--;
      }
   }

   return [low, high];
}

export const taskA = (): number => {
   let [low, high] = [0, 0];
   let count = 1000;

   const modules = data.split('\n');
   const [ffs, cjs] = scanModules(modules);

   while (count) {
      count--;
      const [l, h] = transmit(ffs, cjs);
      low += l;
      high += h;
   }

   return low * high;
}

const transmitB = (ffs: FilpFlop, cjs: Conjunction, start: string): string => {
   const q: Signal[] = [];
   q.push(["broadcaster", start, false]);

   while (q.length) {
      let count = q.length;
      while (count) {
         const [input, module, currSignal] = q.shift();

         if (module in ffs) {
            if (!currSignal) {
               const nextSignal = !ffs[module].state;
               ffs[module].state = !ffs[module].state;

               for (const dest of ffs[module].dest) {
                  q.push([module, dest, nextSignal]);
               }
            }
         }

         if (module in cjs) {
            cjs[module].src[input] = currSignal;
            let nextSignal = false;

            for (const srcName in cjs[module].src) {
               if (!cjs[module].src[srcName]) {
                  nextSignal = true;
                  break;
               }
            }

            for (const dest of cjs[module].dest) {
               q.push([module, dest, nextSignal]);
            }
         }

         count--;
      }
   }

   return `${JSON.stringify(ffs)},${JSON.stringify(cjs)}`;
}

const detectLoop = (ffs: FilpFlop, cjs: Conjunction, start: string, cache = {}): number => {
   let count = 0;
   while (true) {
      const key = transmitB(ffs, cjs, start);
      if (key in cache) {
         return count - cache[key];
      }

      cache[key] = count;
      count++;
   }
}

const gcd = (a, b) => {
   if (b === 0) {
      return a;
   }

   return gcd(b, a % b);
}

const lcm = (a, b) => {
   return (a * b) / gcd(a, b);
}

export const taskB = (): number => {
   let count = 1;

   const modules = data.split('\n');

   const [ffs, cjs] = scanModules(modules);

   for (const dest of ffs["broadcaster"].dest) {
      count = lcm(count, detectLoop(ffs, cjs, dest));
   }

   return count;
}
