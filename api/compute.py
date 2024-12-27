import random as r
import sys
import json

class Node:
    def __init__(self):
        self.out = []
        self.is_on_path = False
        self.path_out = None
        self.is_source = True
        self.label = 0
        self.is_hole = False

    def add_edge(self, that):
        arc = Arc(self, that)
        self.out.append(arc.reverse)
        that.out.append(arc)

class Arc:
    def __init__(self, head, tail):
        self.head = head
        if tail is not None:
            self.reverse = Arc(tail, None)
            self.reverse.reverse = self
        else:
            self.reverse = None

def find_path(nodes, holes): #async
    #time.sleep(3)
    
    for node in nodes:
        node.is_on_path = False

    # picking random starting point
    while True:
        #sink = r.choice(nodes)
        num = r.randint(0, len(nodes) - 1)
        sink = nodes[num]
        if sink.is_hole == False: 
            break
        else:
            sink = None
    #sink = r.choice(nodes)
    #print(f"final num :{num}")
    sink.is_on_path = True

    is_not_on_path_count = len(nodes) - 1 - len(holes) # total number of nodes - 1

    while is_not_on_path_count > 0:
        sink.path_out = r.choice(sink.out) #sink.out is neighbors of current node
        sink = sink.path_out.head #sink is now the head of the path_out

        if sink.is_on_path:# backtracking
            sink = sink.path_out.head
            reverseA = None
            node = sink

            while True:
                temp = node.path_out
                node.path_out = reverseA

                reverseA = temp.reverse
                node = temp.head
        
                if node==sink:# and reverseA is not None:
                    break
        
        else:
            sink.is_on_path = True
            is_not_on_path_count -= 1
    
    return True


def label_path(nodes):
    for node in nodes:
        if node.is_hole == False:
            node.is_source = False
        node.is_source = True

    for node in nodes:
        if(node.path_out is not None):
            node.path_out.head.is_source = False
    
    source = None

    for node in nodes:
        if node.is_source and node.is_hole == False:
            source = node
            break

    count = 0
    while(True):
        # if source.is_hole == False:
        count += 1
        source.label = count
        if source.path_out is None:
            break
        source = source.path_out.head

def hole_validity_check(table):
    def dfs(table, i, j, visited):
        n = len(table)
        m = len(table[0])

        # Check boundaries and if the node is a hole or already visited
        if i < 0 or i >= n or j < 0 or j >= m or table[i][j].is_hole or visited[i][j]:
            return

        # Mark the node as visited
        visited[i][j] = True

        # Visit all 8 possible neighbors (diagonals, verticals, horizontals)
        directions = [(-1, -1), (-1, 0), (-1, 1), (0, -1), (0, 1), (1, -1), (1, 0), (1, 1)]
        for direction in directions:
            dfs(table, i + direction[0], j + direction[1], visited)

    # Dimensions of the table
    n = len(table)
    m = len(table[0])

    # Create a visited 2D list initialized to False
    visited = [[False for _ in range(m)] for _ in range(n)]

    island_count = 0

    # Iterate through each node in the table
    for i in range(n):
        for j in range(m):
            # If the node is not a hole and hasn't been visited, it's a new island
            if not table[i][j].is_hole and not visited[i][j]:
                dfs(table, i, j, visited)
                island_count += 1

    return island_count
    

if __name__ == "__main__":
    
    args = sys.argv[1]
    json_args = json.loads(str(args))

    n = json_args["n"]
    m = json_args["m"]
    holes = json_args["holes"]

    table = [[Node() for _ in range(n)] for _ in range(m)]

    for hole in holes:
        table[hole[0]][hole[1]].is_hole = True

    nodes = [table[i][j] for i in range(m) for j in range(n)] # this is flatened table (not 2d array)

    
    # populating edges (connecting all neighbors)
    if hole_validity_check(table) == 1:
        for i in range(len(table)):
            for j in range(len(table[i])):
                

                if [i, j] in holes:
                    table[i][j].is_hole = True
                    continue

                if i >= 1:

                    # top left edge 
                    if j >= 1:
                        if[i-1, j-1] not in holes:
                            table[i-1][j-1].add_edge(table[i][j])

                    # top edge
                    if[i-1, j] not in holes:
                        table[i-1][j].add_edge(table[i][j])

                    # top right edge
                    if j < len(table[i]) - 1: # for very right edge
                        if[i-1, j+1] not in holes:
                            table[i-1][j+1].add_edge(table[i][j])
                
                # left edge
                if j >= 1:
                    if[i, j-1] not in holes:
                        table[i][j-1].add_edge(table[i][j])
        find_path(nodes, holes)
        label_path(nodes)

        for node in nodes:
            if node.is_hole:
                node.label = -1
    
        #display
        print(json.dumps([[table[i][j].label for j in range(n)] for i in range(m)]))
    else:
        print("Invalid table")