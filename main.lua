
-- Life Simulator - Solar2D Main File
local composer = require("composer")

-- Hide status bar
display.setStatusBar(display.HiddenStatusBar)

-- Set up display groups and background
local background = display.newRect(display.contentCenterX, display.contentCenterY, display.contentWidth, display.contentHeight)
background:setFillColor(0.11, 0.11, 0.13) -- Dark slate background

-- Game data
local gameData = require("gameData")

-- Initialize game
gameData.init()

-- Start with character creation scene
composer.gotoScene("scenes.characterCreation", "fade", 500)
