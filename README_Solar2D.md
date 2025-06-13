
# Life Simulator - Solar2D Port

This is a Solar2D (Corona SDK) port of the React-based Life Simulator game.

## Features Implemented:
- Character creation with name and gender selection
- Dark theme UI matching the original design
- Stats system (Health, Happiness, Smartness, Appearance, Fitness)
- Age progression with random events and stat changes
- Family system with parents
- Life events timeline
- Bottom navigation with icons
- Settings with game reset functionality
- Save/Load game data

## Project Structure:
- `main.lua` - Entry point and app initialization
- `config.lua` - Solar2D configuration
- `gameData.lua` - Game state management and character data
- `scenes/characterCreation.lua` - Character creation screen
- `scenes/gameInterface.lua` - Main game interface
- `build.settings` - Build configuration for different platforms

## How to Run:
1. Install Solar2D from https://solar2d.com/
2. Open this project folder in Solar2D Simulator
3. Click "Build" or "Run" to test the game

## Planned Features:
- Activities system (School, Gym, Work, Crime)
- Relationships management
- Career progression
- Achievement system
- More detailed life events
- Sound effects and music
- Better graphics and animations

## Technical Notes:
- Uses Composer for scene management
- Native text fields for input
- JSON for save/load functionality
- Widget library for UI components
- Responsive design for different screen sizes

This port maintains the core gameplay mechanics while adapting to Solar2D's Lua-based framework and mobile-first approach.
