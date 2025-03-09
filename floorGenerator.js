class WallGenerator {
    constructor(width, height) {
        this.width = width;
        this.height = height;
    }

    generate(upStairs, downStairs) {
        const grid = this.initializeGrid();
        this.placeWallSeeds(grid, upStairs, downStairs);
        this.growWalls(grid, upStairs, downStairs);
        this.cleanupIsolatedWalls(grid);
        this.ensurePath(grid, upStairs, downStairs);
        return grid;
    }

    initializeGrid() {
        return Array(this.height).fill().map(() => Array(this.width).fill('.'));
    }

    placeWallSeeds(grid, upStairs, downStairs) {
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                if (this.isNearStairs(x, y, upStairs, downStairs)) {
                    continue;
                }
                if (Math.random() < 0.1) {
                    grid[y][x] = '#';
                }
            }
        }
    }

    growWalls(grid, upStairs, downStairs) {
        for (let i = 0; i < 2; i++) {
            const newGrid = grid.map(row => [...row]);
            
            for (let y = 0; y < this.height; y++) {
                for (let x = 0; x < this.width; x++) {
                    if (this.isNearStairs(x, y, upStairs, downStairs)) {
                        continue;
                    }
                    
                    const adjacentWalls = this.countAdjacentWalls(grid, x, y);
                    
                    if (grid[y][x] === '.') {
                        if (adjacentWalls >= 1 && Math.random() < 0.4 * adjacentWalls) {
                            newGrid[y][x] = '#';
                        }
                    }
                }
            }
            
            for (let y = 0; y < this.height; y++) {
                for (let x = 0; x < this.width; x++) {
                    grid[y][x] = newGrid[y][x];
                }
            }
        }
    }

    cleanupIsolatedWalls(grid) {
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                if (grid[y][x] === '#') {
                    const adjacentWalls = this.countAdjacentWalls(grid, x, y);
                    if (adjacentWalls === 0) {
                        grid[y][x] = '.';
                    }
                }
            }
        }
    }

    countAdjacentWalls(grid, x, y) {
        let count = 0;
        const directions = [
            {x: -1, y: 0}, {x: 1, y: 0},
            {x: 0, y: -1}, {x: 0, y: 1}
        ];
        
        for (const dir of directions) {
            const newX = x + dir.x;
            const newY = y + dir.y;
            if (newX >= 0 && newX < this.width && 
                newY >= 0 && newY < this.height && 
                grid[newY][newX] === '#') {
                count++;
            }
        }
        return count;
    }

    isNearStairs(x, y, upStairs, downStairs) {
        const isNear = (pos) => {
            if (!pos) return false;
            const dx = Math.abs(x - pos.x);
            const dy = Math.abs(y - pos.y);
            return dx <= 2 && dy <= 2;
        };
        return isNear(upStairs) || isNear(downStairs);
    }

    ensurePath(grid, start, end) {
        const path = this.findPath(grid, start, end);
        if (path) {
            path.forEach(({x, y}) => {
                grid[y][x] = '.';
                for (let dy = -1; dy <= 1; dy++) {
                    for (let dx = -1; dx <= 1; dx++) {
                        const newX = x + dx;
                        const newY = y + dy;
                        if (newX >= 0 && newX < this.width && 
                            newY >= 0 && newY < this.height && 
                            Math.random() < 0.3) {
                            grid[newY][newX] = '.';
                        }
                    }
                }
            });
        }
    }

    findPath(grid, start, end) {
        const queue = [[start]];
        const visited = new Set();
        
        while (queue.length > 0) {
            const path = queue.shift();
            const current = path[path.length - 1];
            const key = `${current.x},${current.y}`;
            
            if (current.x === end.x && current.y === end.y) {
                return path;
            }
            
            if (!visited.has(key)) {
                visited.add(key);
                
                const directions = [
                    {x: 0, y: -1}, {x: 1, y: 0},
                    {x: 0, y: 1}, {x: -1, y: 0}
                ];
                
                for (const dir of directions) {
                    const newX = current.x + dir.x;
                    const newY = current.y + dir.y;
                    
                    if (newX >= 0 && newX < this.width && 
                        newY >= 0 && newY < this.height) {
                        const newPath = [...path, {x: newX, y: newY}];
                        queue.push(newPath);
                    }
                }
            }
        }
        return null;
    }
}

class FloorGenerator {
    constructor(width, height, maxFloor = 10) {
        this.width = width;
        this.height = height;
        this.maxFloor = maxFloor;
        this.wallGenerator = new WallGenerator(width, height);
    }

    generateFloor(floorNumber, fromDirection, sourceStairsPosition) {
        let upStairs, downStairs, finish;

        // On max floor, add finish point instead of up stairs
        if (floorNumber === this.maxFloor) {
            downStairs = { x: sourceStairsPosition.x, y: sourceStairsPosition.y };
            do {
                finish = this.getRandomPosition();
            } while (this.isSamePosition(finish, downStairs));

            const maze = this.wallGenerator.generate(finish, downStairs);

            return {
                player: {
                    x: sourceStairsPosition.x,
                    y: sourceStairsPosition.y
                },
                upStairs: null,
                downStairs: downStairs,
                finish: finish,
                maze: maze
            };
        }

        // Normal floor generation
        if (fromDirection === 'up') {
            upStairs = { x: sourceStairsPosition.x, y: sourceStairsPosition.y };
            do {
                downStairs = this.getRandomPosition();
            } while (this.isSamePosition(upStairs, downStairs));
        } else {
            downStairs = { x: sourceStairsPosition.x, y: sourceStairsPosition.y };
            do {
                upStairs = this.getRandomPosition();
            } while (this.isSamePosition(upStairs, downStairs));
        }

        const maze = this.wallGenerator.generate(upStairs, downStairs);

        return {
            player: {
                x: sourceStairsPosition.x,
                y: sourceStairsPosition.y
            },
            upStairs: upStairs,
            downStairs: downStairs,
            finish: null,
            maze: maze
        };
    }

    generateFirstFloor() {
        let upStairs = this.getRandomPosition();
        let downStairs;
        
        do {
            downStairs = this.getRandomPosition();
        } while (this.isSamePosition(upStairs, downStairs));

        const maze = this.wallGenerator.generate(upStairs, downStairs);

        return {
            player: {
                x: Math.floor(this.width / 2),
                y: Math.floor(this.height / 2)
            },
            upStairs: upStairs,
            downStairs: downStairs,
            finish: null,
            maze: maze
        };
    }

    getRandomPosition() {
        return {
            x: Math.floor(Math.random() * this.width),
            y: Math.floor(Math.random() * this.height)
        };
    }

    isSamePosition(pos1, pos2) {
        return pos1 && pos2 && pos1.x === pos2.x && pos1.y === pos2.y;
    }
} 