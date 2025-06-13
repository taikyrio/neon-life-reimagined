
-- Character Creation Scene
local composer = require("composer")
local widget = require("widget")
local gameData = require("gameData")

local scene = composer.newScene()

-- UI elements
local nameField
local genderButtons = {}
local selectedGender = "male"

-- Scene event functions
function scene:create(event)
    local sceneGroup = self.view
    
    -- Background
    local bg = display.newRect(sceneGroup, display.contentCenterX, display.contentCenterY, display.contentWidth, display.contentHeight)
    bg:setFillColor(0.11, 0.11, 0.13)
    
    -- Title
    local title = display.newText(sceneGroup, "Create Your Life", display.contentCenterX, 100, native.systemFontBold, 28)
    title:setFillColor(1, 1, 1)
    
    local subtitle = display.newText(sceneGroup, "Start your journey", display.contentCenterX, 130, native.systemFont, 16)
    subtitle:setFillColor(0.7, 0.7, 0.7)
    
    -- Name input background
    local nameInputBg = display.newRoundedRect(sceneGroup, display.contentCenterX, 200, 250, 40, 8)
    nameInputBg:setFillColor(0.3, 0.3, 0.35)
    nameInputBg.strokeWidth = 1
    nameInputBg:setStrokeColor(0.4, 0.4, 0.45)
    
    -- Name label
    local nameLabel = display.newText(sceneGroup, "Name", display.contentCenterX - 100, 175, native.systemFont, 14)
    nameLabel:setFillColor(0.8, 0.8, 0.8)
    
    -- Name input field
    nameField = native.newTextField(display.contentCenterX, 200, 240, 30)
    nameField.placeholder = "Enter your name"
    nameField:setTextColor(1, 1, 1)
    sceneGroup:insert(nameField)
    
    -- Gender label
    local genderLabel = display.newText(sceneGroup, "Gender", display.contentCenterX - 100, 250, native.systemFont, 14)
    genderLabel:setFillColor(0.8, 0.8, 0.8)
    
    -- Gender buttons
    local function onGenderPress(event)
        selectedGender = event.target.gender
        
        -- Update button appearances
        for i, btn in ipairs(genderButtons) do
            if btn.gender == selectedGender then
                btn:setFillColor(0.2, 0.4, 0.8)
            else
                btn:setFillColor(0.3, 0.3, 0.35)
            end
        end
    end
    
    -- Male button
    local maleBtn = display.newRoundedRect(sceneGroup, display.contentCenterX - 60, 280, 100, 35, 8)
    maleBtn:setFillColor(0.2, 0.4, 0.8)
    maleBtn.strokeWidth = 1
    maleBtn:setStrokeColor(0.4, 0.4, 0.45)
    maleBtn.gender = "male"
    maleBtn:addEventListener("tap", onGenderPress)
    
    local maleText = display.newText(sceneGroup, "Male", display.contentCenterX - 60, 280, native.systemFont, 16)
    maleText:setFillColor(1, 1, 1)
    
    -- Female button
    local femaleBtn = display.newRoundedRect(sceneGroup, display.contentCenterX + 60, 280, 100, 35, 8)
    femaleBtn:setFillColor(0.3, 0.3, 0.35)
    femaleBtn.strokeWidth = 1
    femaleBtn:setStrokeColor(0.4, 0.4, 0.45)
    femaleBtn.gender = "female"
    femaleBtn:addEventListener("tap", onGenderPress)
    
    local femaleText = display.newText(sceneGroup, "Female", display.contentCenterX + 60, 280, native.systemFont, 16)
    femaleText:setFillColor(1, 1, 1)
    
    genderButtons = {maleBtn, femaleBtn}
    
    -- Start Life button
    local function onStartLife(event)
        local name = nameField.text
        if name and string.len(name) > 0 then
            gameData.createCharacter(name, selectedGender)
            composer.gotoScene("scenes.gameInterface", "slideLeft", 500)
        end
    end
    
    local startBtn = display.newRoundedRect(sceneGroup, display.contentCenterX, 350, 200, 45, 12)
    startBtn:setFillColor(0.2, 0.4, 0.8)
    startBtn:addEventListener("tap", onStartLife)
    
    local startText = display.newText(sceneGroup, "Start Life", display.contentCenterX, 350, native.systemFontBold, 18)
    startText:setFillColor(1, 1, 1)
end

function scene:destroy(event)
    if nameField then
        nameField:removeSelf()
        nameField = nil
    end
end

scene:addEventListener("create", scene)
scene:addEventListener("destroy", scene)

return scene
