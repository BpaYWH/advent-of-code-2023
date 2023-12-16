import { data, example } from "./data";

const directs = {
   "r": [0, 1],
   "l": [0, -1],
   "u": [-1, 0],
   "d": [1, 0],
}

const findNext = (map: string[][], x: number, y: number, dir: string): [number, number, string][] => {
   const [dx, dy] = directs[dir];
   const [nx, ny] = [x + dx, y + dy];
   if (nx < 0 || nx >= map.length || ny < 0 || ny >= map[0].length) return [];

   if (map[nx][ny] === ".") return [[nx, ny , dir]];
   if (map[nx][ny] === "|") {
      if (dir === "r" || dir === "l") return [[nx, ny, "u"], [nx, ny, "d"]];
      if (dir === "u" || dir === "d") return [[nx, ny, dir]];
   }
   if (map[nx][ny] === "-") {
      if (dir === "r" || dir === "l") return [[nx, ny, dir]];
      if (dir === "u" || dir === "d") return [[nx, ny, "r"], [nx, ny, "l"]];
   }
   if (map[nx][ny] === "/") {
      if (dir === "r")  return [[nx, ny, "u"]];
      if (dir === "l")  return [[nx, ny, "d"]]
      if (dir === "u")  return [[nx, ny, "r"]];
      if (dir === "d")  return [[nx, ny, "l"]];
   }
   if (map[nx][ny] === "\\") {
      if (dir === "r")  return [[nx, ny, "d"]];
      if (dir === "l")  return [[nx, ny, "u"]]
      if (dir === "u")  return [[nx, ny, "l"]];
      if (dir === "d")  return [[nx, ny, "r"]];
   }

   return [];
}

const bfs = (map: string[][], q: [number, number, string][]): number => {
   const visited = new Set<string>();
   
   while (q.length) {
      let count = q.length;
      while (count) {
         const [x, y, dir] = q.shift();
         if (visited.has(`${x},${y},${dir}`)) {
            count--;
            continue;
         }
         visited.add(`${x},${y},${dir}`);

         const next = findNext(map, x, y, dir);
         next.forEach(e => q.push(e));

         count--;
      }
   }

   const pVisited = new Set<string>();
   for (const v of visited) {
      const newKey = `${v.split(',')[0]},${v.split(',')[1]}`
      pVisited.add(newKey);
   
   }

   return pVisited.size - 1;
}

export const taskA = (): number => {
   const lines = data.split('\n');
   const map = lines.map(line => line.split(''));
   const q: [number, number, string][] = [[0, -1, "r"]]

   return bfs(map, q);
}

export const taskB = (): number => {
   let res = 0;
   const lines = data.split('\n');
   const map = lines.map(line => line.split(''));
   const starts = [];
   for (let i = 0; i < map.length; i++) {
      starts.push([i, -1, "r"]);
      starts.push([i, map[i].length, "l"]);
   }
   for (let i = 0; i < map[0].length; i++) {
      starts.push([-1, i, "d"]);
      starts.push([map.length, i, "u"]);
   }

   for (const start of starts) {
      const q: [number, number, string][] = [start]

      res = Math.max(res, bfs(map, q));
   }

   return res;
}
