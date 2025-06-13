
-- Main Game Interface Scene
local composer = require("composer")
local widget = require("widget")
local gameData = require("gameData")

local scene = composer.newScene()

-- UI elements
local sceneGroup
local statsGroup
local contentGroup
local navGroup
local activeTab = "timeline"

-- UI update functions
local function updateStats()
    if not gameData.character or not statsGroup then return end
    
    local char = gameData.character
    
    -- Update character info
    if scene.nameText then
        scene.nameText.text = char.name
    end
    if scene.ageText then
        scene.ageText.text = "Age " .. char.age .. " • $" .. string.format("%,d", char.money)
    end
    
    -- Update stat bars
    local stats = {"health", "happiness", "smartness", "appearance", "fitness"}
    local colors = {
        {0.2, 0.8, 0.2}, -- green
        {0.9, 0.9, 0.2}, -- yellow
        {0.2, 0.4, 0.8}, -- blue
        {0.9, 0.2, 0.5}, -- pink
        {0.8, 0.2, 0.2}  -- red
    }
    
    for i, stat in ipairs(stats) do
        local statBar = scene[stat .. "Bar"]
        if statBar then
            local value = char[stat] or 0
            statBar.width = (value / 100) * 200
            statBar:setFillColor(colors[i][1], colors[i][2], colors[i][3])
        end
        
        local statText = scene[stat .. "Text"]
        if statText then
            statText.text = (char[stat] or 0) .. "%"
        end
    end
end

local function createStatsPanel()
    statsGroup = display.newGroup()
    sceneGroup:insert(statsGroup)
    
    -- Stats background
    local statsBg = display.newRoundedRect(statsGroup, display.contentCenterX, 80, display.contentWidth - 20, 120, 8)
    statsBg:setFillColor(0.15, 0.15, 0.18)
    statsBg.strokeWidth = 1
    statsBg:setStrokeColor(0.3, 0.3, 0.35)
    
    -- Character name and info
    scene.nameText = display.newText(statsGroup, "", display.contentCenterX, 40, native.systemFontBold, 20)
    scene.nameText:setFillColor(1, 1, 1)
    
    scene.ageText = display.newText(statsGroup, "", display.contentCenterX, 60, native.systemFont, 14)
    scene.ageText:setFillColor(0.8, 0.8, 0.8)
    
    -- Stat bars
    local stats = {"health", "happiness", "smartness", "appearance", "fitness"}
    local statLabels = {"Health", "Happiness", "Smarts", "Looks", "Fitness"}
    local yPositions = {85, 100, 115, 130, 145}
    
    for i, stat in ipairs(stats) do
        local y = yPositions[i]
        
        -- Stat label
        local label = display.newText(statsGroup, statLabels[i], 50, y, native.systemFont, 10)
        label:setFillColor(0.8, 0.8, 0.8)
        
        -- Stat bar background
        local barBg = display.newRect(statsGroup, 150, y, 200, 8)
        barBg:setFillColor(0.3, 0.3, 0.35)
        
        -- Stat bar
        scene[stat .. "Bar"] = display.newRect(statsGroup, 50, y, 0, 8)
        scene[stat .. "Bar"].anchorX = 0
        
        -- Stat value text
        scene[stat .. "Text"] = display.newText(statsGroup, "0%", 270, y, native.systemFont, 10)
        scene[stat .. "Text"]:setFillColor(1, 1, 1)
    end
end

local function createBottomNav()
    navGroup = display.newGroup()
    sceneGroup:insert(navGroup)
    
    -- Navigation background
    local navBg = display.newRect(navGroup, display.contentCenterX, display.contentHeight - 30, display.contentWidth, 60)
    navBg:setFillColor(0.15, 0.15, 0.18)
    navBg.strokeWidth = 1
    navBg:setStrokeColor(0.3, 0.3, 0.35)
    
    -- Navigation buttons
    local buttons = {
        {id = "relationships", icon = "♥", x = 50},
        {id = "profile", icon = "👤", x = 110},
        {id = "activities", icon = "💼", x = 170},
        {id = "timeline", icon = "📅", x = 230},
        {id = "settings", icon = "⚙", x = 290}
    }
    
    local function onNavPress(event)
        activeTab = event.target.tabId
        updateContent()
        
        -- Update button appearances
        for i, btn in ipairs(scene.navButtons or {}) do
            if btn.tabId == activeTab then
                btn:setFillColor(0.2, 0.4, 0.8)
            else
                btn:setFillColor(0.3, 0.3, 0.35)
            end
        end
    end
    
    scene.navButtons = {}
    
    for i, button in ipairs(buttons) do
        local btn = display.newRoundedRect(navGroup, button.x, display.contentHeight - 30, 40, 40, 8)
        btn:setFillColor(button.id == "timeline" and 0.2 or 0.3, button.id == "timeline" and 0.4 or 0.3, button.id == "timeline" and 0.8 or 0.35)
        btn.tabId = button.id
        btn:addEventListener("tap", onNavPress)
        
        local icon = display.newText(navGroup, button.icon, button.x, display.contentHeight - 30, native.systemFont, 20)
        icon:setFillColor(1, 1, 1)
        
        table.insert(scene.navButtons, btn)
    end
end

function updateContent()
    -- Clear existing content
    if contentGroup then
        contentGroup:removeSelf()
    end
    
    contentGroup = display.newGroup()
    sceneGroup:insert(contentGroup)
    
    if activeTab == "timeline" then
        createTimelineView()
    elseif activeTab == "activities" then
        createActivitiesView()
    elseif activeTab == "relationships" then
        createRelationshipsView()
    elseif activeTab == "profile" then
        createProfileView()
    elseif activeTab == "settings" then
        createSettingsView()
    end
end

function createTimelineView()
    local char = gameData.character
    if not char then return end
    
    -- Character info card
    local infoBg = display.newRoundedRect(contentGroup, display.contentCenterX, 200, display.contentWidth - 20, 80, 8)
    infoBg:setFillColor(0.15, 0.15, 0.18)
    infoBg.strokeWidth = 1
    infoBg:setStrokeColor(0.3, 0.3, 0.35)
    
    local infoText = display.newText(contentGroup, "You are a " .. char.age .. " year old " .. char.gender, display.contentCenterX, 180, native.systemFont, 14)
    infoText:setFillColor(0.8, 0.8, 0.8)
    
    local jobText = display.newText(contentGroup, "Job: " .. char.job, display.contentCenterX, 200, native.systemFont, 12)
    jobText:setFillColor(0.8, 0.8, 0.8)
    
    local eduText = display.newText(contentGroup, "Education: " .. char.education, display.contentCenterX, 215, native.systemFont, 12)
    eduText:setFillColor(0.8, 0.8, 0.8)
    
    -- Recent events
    local eventsLabel = display.newText(contentGroup, "Recent Events", 30, 270, native.systemFontBold, 16)
    eventsLabel.anchorX = 0
    eventsLabel:setFillColor(1, 1, 1)
    
    -- Show last 3 events
    local recentEvents = {}
    for i = math.max(1, #char.lifeEvents - 2), #char.lifeEvents do
        table.insert(recentEvents, char.lifeEvents[i])
    end
    
    for i, event in ipairs(recentEvents) do
        local eventBg = display.newRoundedRect(contentGroup, display.contentCenterX, 290 + (i * 40), display.contentWidth - 20, 35, 6)
        eventBg:setFillColor(0.15, 0.15, 0.18)
        
        local eventText = display.newText(contentGroup, event.event, 30, 290 + (i * 40), native.systemFont, 12)
        eventText.anchorX = 0
        eventText:setFillColor(1, 1, 1)
        
        local ageText = display.newText(contentGroup, "Age " .. event.age, display.contentWidth - 30, 290 + (i * 40), native.systemFont, 10)
        ageText.anchorX = 1
        ageText:setFillColor(0.6, 0.6, 0.6)
    end
    
    -- Age Up button
    local function onAgeUp()
        gameData.ageUp()
        updateStats()
        updateContent()
    end
    
    local ageBtn = display.newRoundedRect(contentGroup, display.contentCenterX, 450, 150, 45, 12)
    ageBtn:setFillColor(0.2, 0.6, 0.2)
    ageBtn:addEventListener("tap", onAgeUp)
    
    local ageBtnText = display.newText(contentGroup, "Age Up!", display.contentCenterX, 450, native.systemFontBold, 18)
    ageBtnText:setFillColor(1, 1, 1)
end

function createActivitiesView()
    local activitiesLabel = display.newText(contentGroup, "Activities", display.contentCenterX, 200, native.systemFontBold, 20)
    activitiesLabel:setFillColor(1, 1, 1)
    
    local comingSoonText = display.newText(contentGroup, "Coming Soon!", display.contentCenterX, 250, native.systemFont, 16)
    comingSoonText:setFillColor(0.7, 0.7, 0.7)
end

function createRelationshipsView()
    local relationshipsLabel = display.newText(contentGroup, "Relationships", display.contentCenterX, 200, native.systemFontBold, 20)
    relationshipsLabel:setFillColor(1, 1, 1)
    
    local comingSoonText = display.newText(contentGroup, "Coming Soon!", display.contentCenterX, 250, native.systemFont, 16)
    comingSoonText:setFillColor(0.7, 0.7, 0.7)
end

function createProfileView()
    local profileLabel = display.newText(contentGroup, "Profile", display.contentCenterX, 200, native.systemFontBold, 20)
    profileLabel:setFillColor(1, 1, 1)
    
    local comingSoonText = display.newText(contentGroup, "Coming Soon!", display.contentCenterX, 250, native.systemFont, 16)
    comingSoonText:setFillColor(0.7, 0.7, 0.7)
end

function createSettingsView()
    local settingsLabel = display.newText(contentGroup, "Settings", display.contentCenterX, 200, native.systemFontBold, 20)
    settingsLabel:setFillColor(1, 1, 1)
    
    -- Reset game button
    local function onResetGame()
        local alert = native.showAlert("Reset Game", "Are you sure you want to reset your game? This cannot be undone.", {"Cancel", "Reset"}, 
            function(event)
                if event.action == "clicked" and event.index == 2 then
                    gameData.init()
                    composer.gotoScene("scenes.characterCreation", "fade", 500)
                end
            end)
    end
    
    local resetBtn = display.newRoundedRect(contentGroup, display.contentCenterX, 300, 200, 40, 8)
    resetBtn:setFillColor(0.8, 0.2, 0.2)
    resetBtn:addEventListener("tap", onResetGame)
    
    local resetText = display.newText(contentGroup, "Reset Game", display.contentCenterX, 300, native.systemFont, 16)
    resetText:setFillColor(1, 1, 1)
end

-- Scene event functions
function scene:create(event)
    sceneGroup = self.view
    
    -- Background
    local bg = display.newRect(sceneGroup, display.contentCenterX, display.contentCenterY, display.contentWidth, display.contentHeight)
    bg:setFillColor(0.11, 0.11, 0.13)
    
    createStatsPanel()
    createBottomNav()
    updateContent()
    updateStats()
end

function scene:show(event)
    if event.phase == "will" then
        updateStats()
        updateContent()
    end
end

scene:addEventListener("create", scene)
scene:addEventListener("show", scene)

return scene
