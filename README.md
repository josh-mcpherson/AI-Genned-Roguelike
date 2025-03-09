# Minimal Roguelike

A simple ASCII-based roguelike game implemented in JavaScript. The game features procedurally generated dungeons with multiple floors connected by staircases.

## Features

- Procedurally generated dungeon floors
- Connected floor system with up and down staircases
- Wall generation with natural-looking corridors
- Guaranteed paths between stairs
- Persistent floor layouts when revisiting

## Controls

- Arrow keys: Move the player character (@)
- '<' key: Go up stairs (when standing on '<')
- '>' key: Go down stairs (when standing on '>')

## Game Elements

- '@': Player character
- '#': Walls
- '.': Floor
- '<': Stairs going up
- '>': Stairs going down

## How to Play

Simply open `index.html` in a web browser to start playing. No server or build process required.

## Project Structure

- `index.html`: Main game page and styling
- `game.js`: Core game logic and rendering
- `floorGenerator.js`: Floor and maze generation system

## Technical Details

The game is built using vanilla JavaScript and uses a class-based architecture:
- `Game`: Manages game state, player input, and rendering
- `FloorGenerator`: Handles floor generation and stair placement
- `WallGenerator`: Creates maze-like wall structures with pathfinding 