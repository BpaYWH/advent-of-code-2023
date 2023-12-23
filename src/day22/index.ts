import { data, example } from "./data";

type Span = {
   span: Set<string>,
   z: number[],
   bot: Set<number>
}

const reg = (register: {[coord: string]: number}, span: Span, spanId: number) => {
   for (let i = span.z[0]; i <= span.z[1]; i++) {
      for (const grid of span.span) {
         const key = `${grid},${i}`;
         register[key] = spanId;
      }
   }
}

const fall = (spans: Span[]) => {
   const register: {[coord: string]: number} = {};
   const ground = 1;

   // update spans
   for (let i = 0; i < spans.length; i++) {
      if (spans[i].z[0] === ground) {
         reg(register, spans[i], i);
         continue;
      }
      
      let nextZ = spans[i].z[0] - 1;
      while (nextZ >= ground) {
         for (const grid of spans[i].span) {
            const key = `${grid},${nextZ}`;
            if (key in register) {
               spans[i].bot.add(register[key]);
            }
         }

         if (spans[i].bot.size) {
            nextZ++;
            const diff = spans[i].z[0] - nextZ;
            spans[i].z = [nextZ, spans[i].z[1] - diff];
            break;
         }

         nextZ--;
      }

      if (!spans[i].bot.size) {
         const diff = spans[i].z[0] - ground;
         spans[i].z = [ground, spans[i].z[1] - diff];
      }

      reg(register, spans[i], i);
   }
}

const brickSpans = (bricks: number[][][]): Span[] => {
   const res: Span[] = [];

   for (let i = 0; i < bricks.length; i++) {
      const spans: Set<string> = new Set();
      const [x1, y1, z1] = bricks[i][0];
      const [x2, y2, z2] = bricks[i][1];

      for (let j = x1; j <= x2; j++) {
         for (let k = y1; k <= y2; k++) {
            spans.add(`${j},${k}`);
         }
      }

      const span: Span = {
         span: spans,
         z: [z1, z2],
         bot: new Set<number>()
      };
      res.push(span);
   }

   return res;
}

export const taskA = (): number => {
   let res = 0;

   const lines = data.split("\n");
   const bricksStr = lines.map(line => line.split("~"));
   const bricks: number[][][] = [];

   for (const brickStr of bricksStr) {
      const temp = [];
      for (const str of brickStr) {
         const [xs, ys, zs] = str.split(",");
         const x = parseInt(xs);
         const y = parseInt(ys);
         const z = parseInt(zs);

         temp.push([x, y, z]);
      }
      bricks.push([...temp]);
   }
   bricks.sort((a, b) => {
      if (a[0][2] === b[0][2]) {
         if (a[0][1] === b[0][1]) {
            return a[0][0] - b[0][0]
         }
         return a[0][1] - b[0][1];
      }
      return a[0][2] - b[0][2];
   });

   const spans = brickSpans(bricks);
   fall(spans);

   for (let i = 0; i < spans.length; i++) {
      let canRemove = true;
      for (let j = i + 1; j < spans.length; j++) {
         if (spans[j].bot.has(i) && spans[j].bot.size === 1) {
            canRemove = false;
            break;
         }
      }
      if (canRemove) {
         res++;
      }
   }

   return res;
}

const isSubset = (superSet: Set<number>, subSet: Set<number>): boolean => {
   for (const i of subSet) {
      if (!superSet.has(i)) {
         return false;
      } 
   }

   return true;
}

const chainReaction = (spans: Span[], id: number): number => {
   let res = 0;
   let q = new Set<number>([id]);
   const falled = new Set<number>([id]);

   while (q.size) {
      const nextQ = new Set<number>();

      for (let i = 0; i < spans.length; i++) {
         if (spans[i].bot.size && !falled.has(i) && isSubset(falled, spans[i].bot)) {
            falled.add(i);
            nextQ.add(i);
            res++;
         }
      }

      q = nextQ;
   }

   return res;
}

export const taskB = (): number => {
   let res = 0;

   const lines = data.split("\n");
   const bricksStr = lines.map(line => line.split("~"));
   const bricks: number[][][] = [];

   for (const brickStr of bricksStr) {
      const temp = [];
      for (const str of brickStr) {
         const [xs, ys, zs] = str.split(",");
         const x = parseInt(xs);
         const y = parseInt(ys);
         const z = parseInt(zs);

         temp.push([x, y, z]);
      }
      bricks.push([...temp]);
   }
   bricks.sort((a, b) => {
      if (a[0][2] === b[0][2]) {
         if (a[0][1] === b[0][1]) {
            return a[0][0] - b[0][0]
         }
         return a[0][1] - b[0][1];
      }
      return a[0][2] - b[0][2];
   });

   const spans = brickSpans(bricks);
   fall(spans);

   for (let i = 0; i < spans.length; i++) {
      res += chainReaction(spans, i);
   }

   return res;
}
