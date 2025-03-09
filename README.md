# Minimal Roguelike

A simple ASCII-based roguelike game implemented in JavaScript. The game features procedurally generated dungeons with multiple floors connected by staircases.

> This project was developed through pair programming with an AI assistant (Claude) in Cursor IDE. The AI helped with code architecture, implementation, and documentation while maintaining clean, modular design principles.

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
- `devlog.txt`: Development log tracking major changes and design decisions

## Technical Details

The game is built using vanilla JavaScript and uses a class-based architecture:
- `Game`: Manages game state, player input, and rendering
- `FloorGenerator`: Handles floor generation and stair placement
- `WallGenerator`: Creates maze-like wall structures with pathfinding

## Development Process

The project was developed iteratively with AI assistance, focusing on:
- Clean code organization and modularity
- Clear separation of concerns
- Documented design decisions and changes
- Maintainable and extensible architecture

Each major feature was developed through collaborative discussion and refinement, with the development process tracked in the devlog. 