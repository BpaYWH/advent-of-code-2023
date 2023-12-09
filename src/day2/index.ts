import { data } from "./data"


// red, green, blue
interface Bag {
   "red": number,
   "green": number,
   "blue": number,
}

const requirement: Bag = {
   "red": 12,
   "green": 13,
   "blue": 14,
};

type Info = Record<number, Bag>

const extractInfo = (line: string): Info  => {
   // line = "Game 100: 14 green, 6 blue, 12 red; 2 green, 1 blue, 2 red; 12 red, 7 blue, 3 green; 1 blue, 12 red, 8 green"
   const [game, actions] = line.split(":");
   const gameNo = game.split(" ")[1];
   const records = actions.split(";");
   let bag: Bag = {
      "red": 0,
      "green": 0,
      "blue": 0
   };

   records.forEach(record => {
      const pairs = record.split(",");
      pairs.forEach(pair => {
         const [count, color] = pair.trim().split(" ");
         bag[color] = Math.max(bag[color], Number(count));
      })
   });

   return {[Number(gameNo)]: bag};
}

const validate = (info: Info): boolean => {
   return Object.values(info).some(bag => {
      return Object.keys(bag).every(color => {
         return bag[color] <= requirement[color];
      })
   });
}

export const taskA = (): number => {
   let sum: number = 0;
   const infos: Info[] = [];

   const lines = data.split('\n');
   lines.forEach(line => {
      infos.push(extractInfo(line));
   });

   infos.forEach(info => {
      if (validate(info)) {
         const gameId = Number(Object.keys(info)[0]);
         // console.log(lines[gameId - 1]);
         sum += gameId;
      }
   });

   console.log(sum);
   return sum;
}

const extractPower = (line: string): number => {
   let power = 1;
   const actions = line.split(":")[1];
   const records = actions.split(";");
   const bag: Bag = {
      "red": 0,
      "green": 0,
      "blue": 0
   };

   records.forEach(record => {
      const pairs = record.split(",");
      pairs.forEach(pair => {
         const [count, color] = pair.trim().split(" ");
         bag[color] = Math.max(bag[color], Number(count));
      })
   });

   for (const color in bag) {
      power *= bag[color];
   }

   console.log(power);
   return power;
}

export const taskB = (): void => {
   let sum: number = 0;

   const lines = data.split('\n');
   lines.forEach(line => {
      sum += extractPower(line);
   });


   console.log(sum);
}
