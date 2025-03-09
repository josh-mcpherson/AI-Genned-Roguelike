class Game {
    constructor(width = 20, height = 10) {
        this.width = width;
        this.height = height;
        this.currentFloor = 1;
        this.floors = new Map();
        this.floorGenerator = new FloorGenerator(width, height);
        this.initializeFirstFloor();
    }

    initializeFirstFloor() {
        const firstFloor = this.floorGenerator.generateFirstFloor();
        this.floors.set(1, firstFloor);
        this.gameElement = document.getElementById('game');
        this.setupKeyboardControls();
        this.render();
    }

    generateNewFloor(floorNumber, fromDirection, sourceStairsPosition) {
        return this.floorGenerator.generateFloor(fromDirection, sourceStairsPosition);
    }

    setupKeyboardControls() {
        document.addEventListener('keydown', (e) => {
            const currentFloorData = this.floors.get(this.currentFloor);
            let newX = currentFloorData.player.x;
            let newY = currentFloorData.player.y;

            switch (e.key) {
                case 'ArrowUp':
                    newY--;
                    break;
                case 'ArrowDown':
                    newY++;
                    break;
                case 'ArrowLeft':
                    newX--;
                    break;
                case 'ArrowRight':
                    newX++;
                    break;
                case '>':
                    if (this.isOnStairs(currentFloorData.player, currentFloorData.downStairs)) {
                        this.changeFloor(1, currentFloorData.downStairs);
                        return;
                    }
                    break;
                case '<':
                    if (this.isOnStairs(currentFloorData.player, currentFloorData.upStairs)) {
                        this.changeFloor(-1, currentFloorData.upStairs);
                        return;
                    }
                    break;
            }

            if (this.isValidMove(currentFloorData, newX, newY)) {
                currentFloorData.player.x = newX;
                currentFloorData.player.y = newY;
                this.render();
            }
        });
    }

    isOnStairs(player, stairs) {
        return stairs && player.x === stairs.x && player.y === stairs.y;
    }

    changeFloor(direction, sourceStairsPosition) {
        const newFloorNumber = this.currentFloor + direction;
        
        if (newFloorNumber < 1) return;

        if (!this.floors.has(newFloorNumber)) {
            this.floors.set(
                newFloorNumber, 
                this.generateNewFloor(
                    newFloorNumber, 
                    direction > 0 ? 'up' : 'down',
                    sourceStairsPosition
                )
            );
        } else {
            // If floor exists, just move player to the correct stairs position
            const existingFloor = this.floors.get(newFloorNumber);
            existingFloor.player.x = sourceStairsPosition.x;
            existingFloor.player.y = sourceStairsPosition.y;
        }

        this.currentFloor = newFloorNumber;
        this.render();
    }

    isValidMove(floorData, x, y) {
        return x >= 0 && x < this.width && 
               y >= 0 && y < this.height && 
               floorData.maze[y][x] !== '#';
    }

    render() {
        const currentFloorData = this.floors.get(this.currentFloor);
        let display = `Floor ${this.currentFloor}\n`;
        
        // Top wall
        display += '#'.repeat(this.width + 2) + '\n';
        
        // Game area
        for (let y = 0; y < this.height; y++) {
            display += '#'; // Left wall
            for (let x = 0; x < this.width; x++) {
                if (x === currentFloorData.player.x && y === currentFloorData.player.y) {
                    display += '@';
                } else if (currentFloorData.upStairs && x === currentFloorData.upStairs.x && y === currentFloorData.upStairs.y) {
                    display += '<';
                } else if (currentFloorData.downStairs && x === currentFloorData.downStairs.x && y === currentFloorData.downStairs.y) {
                    display += '>';
                } else {
                    display += currentFloorData.maze[y][x];
                }
            }
            display += '#\n'; // Right wall
        }
        
        // Bottom wall
        display += '#'.repeat(this.width + 2);
        
        this.gameElement.textContent = display;
    }
}

// Start the game when the page loads
window.onload = () => {
    new Game();
}; 