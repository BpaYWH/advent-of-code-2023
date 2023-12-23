import { data, example } from "./data";

const slope = {
   ">": [0, 1],
   "<": [0, -1],
   "v": [1, 0],
   "^": [-1, 0],
};
const slopeSet = new Set(Object.keys(slope));

const cachePreproceess = (visited: boolean[][], track: number[][], map: string[][]) => {
   for (let i = 0; i < map.length; i++) {
      for (let j = 0; j < map[0].length; j++) {
         if (map[i][j] === "#") {
            track[i][j] = -1;
            visited[i][j] = true;
         }
      }
   }
}

const dfs = (map: string[][], sr: number, sc: number, er: number, ec: number, visited: boolean[][], track: number[][], step: number = 0) => {
   track[sr][sc] = Math.max(track[sr][sc], step);
   
   if (sr === er && sc === ec) {
      return;
   }

   visited[sr][sc] = true;

   for (const direct of Object.keys(slope)) {
      const [dr, dc] = slope[direct];
      let nr = sr + dr;
      let nc = sc + dc;
      let nextStep = step + 1;

      if (nr >= 0 && nr < map.length && nc >= 0 && nc < map[0].length) {
         if (slopeSet.has(map[nr][nc])) {
            if (map[nr][nc] === direct) {
               nr += dr;
               nc += dc;
               nextStep++;
               if (!visited[nr][nc]) {
                  dfs(map, nr, nc, er, ec, visited, track, nextStep);
               }
            }
         } else {
            if (!visited[nr][nc]) {
               dfs(map, nr, nc, er, ec, visited, track, nextStep);
            }
         }
      }
   }

   visited[sr][sc] = false;
}

export const taskA = (): number => {
   const map = data.split('\n').map(x => x.split(''));
   const [sr, sc] = [0, 1];
   const [er, ec] = [map.length - 1, map[0].length - 2];
   const visited = new Array(map.length).fill(0).map(() => new Array(map[0].length).fill(false));
   const track = new Array(map.length).fill(0).map(() => new Array(map[0].length).fill(0));
   visited[sr][sc] = true;

   cachePreproceess(visited, track, map);
   dfs(map, sr, sc, er, ec, visited, track);

   return track[er][ec];
}

const mapPreprocess = (map: string[][]) => {
   for (let i = 0; i < map.length; i++) {
      for (let j = 0; j < map[0].length; j++) {
         if (slopeSet.has(map[i][j])) {
            map[i][j] = ".";
         }
      }
   }
}

export const taskB = (): number => {
   const map = data.split('\n').map(x => x.split(''));
   const [sr, sc] = [0, 1];
   const [er, ec] = [map.length - 1, map[0].length - 2];
   const visited = new Array(map.length).fill(0).map(() => new Array(map[0].length).fill(false));
   const track = new Array(map.length).fill(0).map(() => new Array(map[0].length).fill(0));
   
   mapPreprocess(map);
   cachePreproceess(visited, track, map);
   dfs(map, sr, sc, er, ec, visited, track); // 20 mins

   return track[er][ec];
}
