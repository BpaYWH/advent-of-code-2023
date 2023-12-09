import { allSeeds, seed_soil, soil_fert, fert_water, water_light, light_temp, temp_humid, humid_loc } from "./data";

// intervals: [[srcStart, srcEnd, destStart, destEnd]]

const mapToIntvs = (data: string): number[][] => {
   const intvs: number[][] = [];

   data.split("\n").forEach((line: string) => {
      const [destStart, srcStart, y] = line.split(" ");
      const [srcStartNum, destStartNum, yNum] = [parseInt(srcStart), parseInt(destStart), parseInt(y)];
      intvs.push([srcStartNum, srcStartNum + yNum - 1, destStartNum, destStartNum + yNum - 1]);
   });

   intvs.sort((a, b) => a[0] - b[0]);

   return intvs;
}

export const taskA = (): void => {
   let res = Infinity;
   const seeds = allSeeds.split(" ");
   const seed_soil_intvs = mapToIntvs(seed_soil);
   const soil_fert_intvs = mapToIntvs(soil_fert);
   const fert_water_intvs = mapToIntvs(fert_water);
   const water_light_intvs = mapToIntvs(water_light);
   const light_temp_intvs = mapToIntvs(light_temp);
   const temp_humid_intvs = mapToIntvs(temp_humid);
   const humid_loc_intvs = mapToIntvs(humid_loc);

   seeds.forEach((seed: string) => {
      const seedNum = parseInt(seed);
      let soilNum = seedNum;
      let fertNum = soilNum;
      let waterNum = fertNum;
      let lightNum = waterNum;
      let tempNum = lightNum;
      let humidNum = tempNum;
      let locNum = humidNum;

      const seed_soil_intv = seed_soil_intvs.find((intv: number[]) => intv[0] <= seedNum && intv[1] >= seedNum);
      if (seed_soil_intv === undefined) soilNum = seedNum;
      else soilNum = seedNum - seed_soil_intv[0] + seed_soil_intv[2];

      const soil_fert_intv = soil_fert_intvs.find((intv: number[]) => intv[0] <= soilNum && intv[1] >= soilNum);
      if (soil_fert_intv === undefined) fertNum = soilNum;
      else fertNum = soilNum - soil_fert_intv[0] + soil_fert_intv[2];

      const fert_water_intv = fert_water_intvs.find((intv: number[]) => intv[0] <= fertNum && intv[1] >= fertNum);
      if (fert_water_intv === undefined) waterNum = fertNum;
      else waterNum = fertNum - fert_water_intv[0] + fert_water_intv[2];

      const water_light_intv = water_light_intvs.find((intv: number[]) => intv[0] <= waterNum && intv[1] >= waterNum);
      if (water_light_intv === undefined) lightNum = waterNum;
      else lightNum = waterNum - water_light_intv[0] + water_light_intv[2];

      const light_temp_intv = light_temp_intvs.find((intv: number[]) => intv[0] <= lightNum && intv[1] >= lightNum);
      if (light_temp_intv === undefined) tempNum = lightNum;
      else tempNum = lightNum - light_temp_intv[0] + light_temp_intv[2];

      const temp_humid_intv = temp_humid_intvs.find((intv: number[]) => intv[0] <= tempNum && intv[1] >= tempNum);
      if (temp_humid_intv === undefined) humidNum = tempNum;
      else humidNum = tempNum - temp_humid_intv[0] + temp_humid_intv[2];

      const humid_loc_intv = humid_loc_intvs.find((intv: number[]) => intv[0] <= humidNum && intv[1] >= humidNum);
      if (humid_loc_intv === undefined) locNum = humidNum;
      else locNum = humidNum - humid_loc_intv[0] + humid_loc_intv[2];

      res = Math.min(res, locNum);
   });
   

   console.log(res);
}

const preprocessSeeds = (seeds: string[]): number[][] => {
   const intvs: number[][] = [];
   let count = 0;

   const seedNums = seeds.map((seed: string) => {
      return parseInt(seed);
   });

   for (let i = 0; i < seedNums.length; i += 2) {
      intvs.push([seedNums[i], seedNums[i] + seedNums[i + 1] - 1]);
      count += seedNums[i+1];
   }

   intvs.sort((a, b) => a[0] - b[0]);

   return intvs;
}

const findIntersect = (q: number[][], intvs: number[][]): number[][] => {
   let count = q.length;
   while (count) {
      const firstSrc = q.shift();
      if (!firstSrc) break;

      let srcs: number[][] = [firstSrc];

      while (srcs.length) {
         let src = srcs.pop();
         if (!src) break;
         
         for (let i = 0; i < intvs.length; i++) {
            const intv = intvs[i];

            // |  (  |  )
            if (src[0] < intv[0] && src[1] >= intv[0] && src[1] < intv[1]) {
               srcs.push([src[0], intv[0] - 1]);
               q.push([intv[2], intv[2] + src[1] - intv[0]]);
               break;
            }

            // (   |   )  |
            if (src[0] > intv[0] && src[1] > intv[1] && src[0] <= intv[1]) {
               q.push([intv[2] + src[0] - intv[0], intv[3]]);
               srcs.push([intv[1] + 1, src[1]]);
               break;
            }

            // |  (  )  |
            if (src[0] <= intv[0] && src[1] >= intv[1]) {
               srcs.push([src[0], intv[0] - 1]);
               q.push([intv[2], intv[3]]);
               srcs.push([intv[1] + 1, src[1]]);
               break;
            }

            // (  |     |  )
            if (src[0] >= intv[0] && src[1] <= intv[1]) {
               q.push([intv[2] + src[0] - intv[0], intv[2] + src[1] - intv[0]]);
               break;
            }
         }
      }

      // no intersection
      if (srcs.length) {
         srcs.forEach((src: number[]) => {
            q.push([src[0], src[1]]);
         });
      }

      count--;
   }

   q.sort((a, b) => a[0] - b[0]);

   return q;
};

export const taskB = (): void => {
   let res = Infinity;
   let q = preprocessSeeds(allSeeds.split(" "));
   const seed_soil_intvs = mapToIntvs(seed_soil);
   const soil_fert_intvs = mapToIntvs(soil_fert);
   const fert_water_intvs = mapToIntvs(fert_water);
   const water_light_intvs = mapToIntvs(water_light);
   const light_temp_intvs = mapToIntvs(light_temp);
   const temp_humid_intvs = mapToIntvs(temp_humid);
   const humid_loc_intvs = mapToIntvs(humid_loc);

   q = findIntersect(q, seed_soil_intvs);
   q = findIntersect(q, soil_fert_intvs);
   q = findIntersect(q, fert_water_intvs);
   q = findIntersect(q, water_light_intvs);
   q = findIntersect(q, light_temp_intvs);
   q = findIntersect(q, temp_humid_intvs);
   q = findIntersect(q, humid_loc_intvs);

   res = q[0][0];

   console.log(res);
}
