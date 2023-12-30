import { data, example } from "./data";
import { init } from "z3-solver";

type Hail = {
   x: number,
   y: number,
   z: number,
   vx: number,
   vy: number,
   vz: number
};

const detect = (hailA: Hail, hailB: Hail, lo:number, hi: number): boolean => {
   const mA = hailA.vy / hailA.vx;
   const mB = hailB.vy / hailB.vx;
   
   // parallel
   if (mA === mB) return false;

   const cA = hailA.y - mA * hailA.x;
   const cB = hailB.y - mB * hailB.x;

   const iX = (cB - cA) / (mA - mB);
   const iY = mA * iX + cA;

   // outside
   if (iX < lo || iX > hi || iY < lo || iY > hi) return false;

   // in the past
   if ((iX - hailA.x) / hailA.vx < 0) return false;
   if ((iY - hailA.y) / hailA.vy < 0) return false;

   if ((iX - hailB.x) / hailB.vx < 0) return false;
   if ((iY - hailB.y) / hailB.vy < 0) return false;


   return true;
}

export const taskA = (): number => {
   const lo = 200000000000000;
   const hi = 400000000000000;
   let res = 0;

   const lines = data.split("\n");
   const hails: Hail[] = lines.map(line => {
      const [coordStr, vStr] = line.split(" @ ");
      const [xStr, yStr, zStr] = coordStr.split(", ");
      const [xVStr, yVStr, zVStr] = vStr.split(", ");

      return {
         x: parseInt(xStr),
         y: parseInt(yStr),
         z: parseInt(zStr),
         vx: parseInt(xVStr),
         vy: parseInt(yVStr),
         vz: parseInt(zVStr)
      }
   });

   for (let i = 0; i < hails.length; i++) {
      for (let j = i + 1; j < hails.length; j++) {
         if (detect(hails[i], hails[j], lo, hi)) {
            res++;
         }
      }
   }

   return res;
}

export const taskB = async (): Promise<void> => {
   const lines = data.split("\n");
   const hails: Hail[] = lines.map(line => {
      const [coordStr, vStr] = line.split(" @ ");
      const [xStr, yStr, zStr] = coordStr.split(", ");
      const [xVStr, yVStr, zVStr] = vStr.split(", ");

      return {
         x: parseInt(xStr),
         y: parseInt(yStr),
         z: parseInt(zStr),
         vx: parseInt(xVStr),
         vy: parseInt(yVStr),
         vz: parseInt(zVStr)
      }
   });

   const { Context } = await init();
   const { Real, Solver } = Context('main');

   const solver = new Solver();

	const x = Real.const('x');
	const y = Real.const('y');
	const z = Real.const('z');
	const vx = Real.const('vx');
	const vy = Real.const('vy');
	const vz = Real.const('vz');

   let count = 0;
   for (const hail of hails) {
      const [xi, yi, zi, dxi,  dyi, dzi] = Object.values(hail);

      const t = Real.const(`t${count}`);
      count++;

		solver.add(t.ge(0));
		solver.add(x.add(vx.mul(t)).eq(t.mul(dxi).add(xi)));
		solver.add(y.add(vy.mul(t)).eq(t.mul(dyi).add(yi)));
		solver.add(z.add(vz.mul(t)).eq(t.mul(dzi).add(zi)));
   }

	const satisfied = await solver.check();
	const model = solver.model();
   const [rx, ry, rz] = [model.eval(x), model.eval(y), model.eval(z)];

   const result = await Number(rx) + Number(ry) + Number(rz);
   console.log(result);
   return;
}
