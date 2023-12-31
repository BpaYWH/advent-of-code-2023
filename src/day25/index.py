import networkx

data_path = './src/day25/data.txt'

g = networkx.Graph()

for line in open(data_path):
   src, dests = line.split(':')
   for dest in dests.strip().split(' '):
      g.add_edge(src, dest)
      g.add_edge(dest, src)

g.remove_edges_from(networkx.minimum_edge_cut(g))
left, right = networkx.connected_components(g)

print(len(left) * len(right))
