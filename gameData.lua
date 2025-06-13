
-- Game Data Manager
local gameData = {}

-- Character data structure
gameData.character = nil
gameData.gameStarted = false

-- Initialize game data
function gameData.init()
    gameData.character = nil
    gameData.gameStarted = false
end

-- Create new character
function gameData.createCharacter(name, gender)
    local character = {
        id = tostring(math.random(100000, 999999)),
        name = name,
        age = 0,
        gender = gender,
        birthYear = 2024,
        
        -- Stats
        health = math.random(50, 100),
        happiness = math.random(50, 100),
        smartness = math.random(50, 100),
        appearance = math.random(50, 100),
        fitness = math.random(50, 100),
        
        -- Life status
        money = 0,
        education = "None",
        job = "Unemployed",
        salary = 0,
        
        -- Relationships
        family = {
            {
                id = "1",
                name = gender == "male" and "John Martin" or "Jane Martin",
                relationship = "father",
                age = math.random(25, 45),
                alive = true,
                relationshipLevel = math.random(50, 100)
            },
            {
                id = "2",
                name = gender == "male" and "Mary Martin" or "Maria Martin",
                relationship = "mother",
                age = math.random(25, 45),
                alive = true,
                relationshipLevel = math.random(50, 100)
            }
        },
        relationships = {},
        
        -- Life events
        lifeEvents = {
            {
                id = "1",
                year = 2024,
                age = 0,
                event = name .. " was born!",
                type = "positive"
            }
        },
        
        achievements = {},
        criminalRecord = {},
        assets = {}
    }
    
    gameData.character = character
    gameData.gameStarted = true
    return character
end

-- Age up character
function gameData.ageUp()
    if not gameData.character then return end
    
    local char = gameData.character
    char.age = char.age + 1
    
    -- Apply random stat changes
    local statChanges = {
        health = math.random(-5, 5),
        happiness = math.random(-5, 5),
        smartness = math.random(-2, 3),
        appearance = math.random(-3, 3),
        fitness = math.random(-4, 4)
    }
    
    -- Apply changes with bounds
    for stat, change in pairs(statChanges) do
        char[stat] = math.max(0, math.min(100, char[stat] + change))
    end
    
    -- Random life events
    local randomEvents = {
        "Had a great day at school",
        "Made a new friend",
        "Learned something new",
        "Had a peaceful day",
        "Enjoyed time with family",
        "Got sick and stayed home",
        "Had an argument with a friend",
        "Received a compliment",
        "Failed a test",
        "Won a small prize"
    }
    
    if math.random() < 0.4 then
        local event = randomEvents[math.random(1, #randomEvents)]
        local eventType = "neutral"
        
        if string.find(event, "great") or string.find(event, "Won") or string.find(event, "compliment") then
            eventType = "positive"
        elseif string.find(event, "sick") or string.find(event, "argument") or string.find(event, "Failed") then
            eventType = "negative"
        end
        
        table.insert(char.lifeEvents, {
            id = tostring(math.random(100000, 999999)),
            year = char.birthYear + char.age,
            age = char.age,
            event = event,
            type = eventType
        })
    end
    
    -- Age family members
    for i = 1, #char.family do
        char.family[i].age = char.family[i].age + 1
    end
end

-- Save/Load functions (using Solar2D's document directory)
function gameData.save()
    local json = require("json")
    local path = system.pathForFile("gameData.json", system.DocumentsDirectory)
    local file = io.open(path, "w")
    
    if file then
        local jsonString = json.encode(gameData.character)
        file:write(jsonString)
        io.close(file)
        return true
    end
    return false
end

function gameData.load()
    local json = require("json")
    local path = system.pathForFile("gameData.json", system.DocumentsDirectory)
    local file = io.open(path, "r")
    
    if file then
        local contents = file:read("*a")
        io.close(file)
        local decodedData = json.decode(contents)
        if decodedData then
            gameData.character = decodedData
            gameData.gameStarted = true
            return true
        end
    end
    return false
end

return gameData
