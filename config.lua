
-- Solar2D Configuration
application = {
    content = {
        width = 320,
        height = 568,
        scale = "letterBox",
        fps = 60,
        
        imageSuffix = {
            ["@2x"] = 2,
            ["@4x"] = 4,
        },
    },
    
    notification = {
        iphone = {
            types = {
                "badge", "sound", "alert", "newsstand"
            }
        }
    }
}
