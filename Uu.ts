// Add your code here
//%icon=""
//%block="CRAZY EFFECTS"
//%color=#FF0000
namespace glitchEffect {
    //% block="corrupt $sprite over $duration ms"
    //% sprite.shadow=variables_get
    //% duration.shadow=timePicker
    export function corruptSprite(sprite: Sprite, duration: number) {
        let original = sprite.image.clone()
        let corrupted = original.clone()
        let endTime = game.runtime() + duration

        game.onUpdateInterval(50, function () {
            if (game.runtime() > endTime) return

            // **Randomly change pixels**
            for (let i = 0; i < corrupted.width * 0.2; i++) { // 20% of pixels change
                let x = randint(0, corrupted.width - 1)
                let y = randint(0, corrupted.height - 1)
                let glitchColor = randint(2, 14) // Random colors
                corrupted.setPixel(x, y, glitchColor)
            }

            // **Slight screen shake**
            sprite.x += randint(-1, 1)
            sprite.y += randint(-1, 1)

            // **Apply corruption**
            sprite.setImage(corrupted)
        })

        // **Slow fade out effect**
        control.runInParallel(function () {
            for (let i = 15; i >= 0; i--) {
                let faded = corrupted.clone()
                for (let x = 0; x < faded.width; x++) {
                    for (let y = 0; y < faded.height; y++) {
                        if (faded.getPixel(x, y) != 0) faded.setPixel(x, y, i)
                    }
                }
                sprite.setImage(faded)
                pause(80) // **Wait before the next fade step**
            }
            sprite.setImage(img``) // **Sprite disappears**
        })
    }
        //% block="glitch shake $sprite for $duration ms"
        //% sprite.shadow=variables_get
        //% duration.shadow=timePicker
        export function glitchShake(sprite: Sprite, duration: number) {
            let endTime = game.runtime() + duration

            game.onUpdateInterval(50, function () {
                if (game.runtime() > endTime) return

                sprite.x += randint(-2, 2)
                sprite.y += randint(-2, 2)
            })
        }
        //% block="enable afterimage effect on $sprite"
        //% sprite.shadow=variables_get
        export function afterimageEffect(sprite: Sprite) {
            game.onUpdateInterval(100, function () {
                let ghost = sprite.image.clone()
                let ghostSprite = sprites.create(ghost, SpriteKind.Food)
                ghostSprite.setPosition(sprite.x, sprite.y)
                ghostSprite.setFlag(SpriteFlag.Ghost, true)
                ghostSprite.setFlag(SpriteFlag.AutoDestroy, true)
                ghostSprite.lifespan = 200
                ghostSprite.image.replace(1, 3) // Make it slightly faded
            })
        }
        //% block="pixel shift $sprite intensity $intensity every $interval ms"
        //% sprite.shadow=variables_get
        //% intensity.min=1 intensity.max=5
        //% interval.shadow=timePicker
        export function pixelShift(sprite: Sprite, intensity: number, interval: number) {
            game.onUpdateInterval(interval, function () {
                let img = sprite.image.clone()
                for (let x = 0; x < img.width; x++) {
                    for (let y = 0; y < img.height; y++) {
                        if (Math.percentChance(30)) { // Randomly shift some pixels
                            let dx = x + randint(-intensity, intensity)
                            let dy = y + randint(-intensity, intensity)

                            if (dx >= 0 && dx < img.width && dy >= 0 && dy < img.height) {
                                img.setPixel(x, y, sprite.image.getPixel(dx, dy))
                            }
                        }
                    }
                }
                sprite.setImage(img)
            })
        }
    //% block="apply scanline overlay to $sprite with spacing $spacing"
    //% sprite.shadow=variables_get
    //% spacing.min=1 spacing.max=10
    export function scanlineOverlay(sprite: Sprite, spacing: number) {
        let img = sprite.image.clone()
        for (let y = 0; y < img.height; y += spacing) {
            for (let x = 0; x < img.width; x++) {
                img.setPixel(x, y, 0) // Black scanline
            }
        }
        sprite.setImage(img)
    }
    //% block="apply hue shift to $sprite with shift $amount"
    //% sprite.shadow=variables_get
    //% amount.min=1 amount.max=255
    export function hueShift(sprite: Sprite, amount: number) {
        let img = sprite.image.clone()
        for (let x = 0; x < img.width; x++) {
            for (let y = 0; y < img.height; y++) {
                let oldColor = img.getPixel(x, y)
                if (oldColor !== 0) { // Avoid shifting transparent pixels
                    let newColor = (oldColor + amount) % 15 // Wrap colors around
                    img.setPixel(x, y, newColor)
                }
            }
        }
        sprite.setImage(img)
    }
    //% block="apply outline plus to $sprite with color $color"
    //% sprite.shadow=variables_get
    //% color.shadow=colorindexpicker
    export function outlinePlus(sprite: Sprite, color: number) {
        let img = sprite.image.clone()
        let outlinedImg = image.create(img.width + 2, img.height + 2)

        // Copy original image into the center of new image
        outlinedImg.drawTransparentImage(img, 1, 1)

        // Loop through each pixel and add an outline
        for (let x = 0; x < img.width; x++) {
            for (let y = 0; y < img.height; y++) {
                if (img.getPixel(x, y) != 0) { // Not transparent
                    for (let dx = -1; dx <= 1; dx++) {
                        for (let dy = -1; dy <= 1; dy++) {
                            if (outlinedImg.getPixel(x + dx + 1, y + dy + 1) == 0) {
                                outlinedImg.setPixel(x + dx + 1, y + dy + 1, color)
                            }
                        }
                    }
                }
            }
        }

        sprite.setImage(outlinedImg)
    }
    //% block="apply afterimage trail to $sprite with color $color lasting $duration ms"
    //% sprite.shadow=variables_get
    //% color.shadow=colorindexpicker
    //% duration.min=50 duration.max=1000
    export function afterimageTrail(sprite: Sprite, color: number, duration: number) {
        game.onUpdateInterval(50, function () {
            let ghost = image.create(sprite.width, sprite.height)
            ghost.drawTransparentImage(sprite.image, 0, 0)
            ghost.replace(1, color) // Tint effect
            let ghostSprite = sprites.create(ghost, SpriteKind.Food)
            ghostSprite.setPosition(sprite.x, sprite.y)
            ghostSprite.lifespan = duration // Fades out
            ghostSprite.z = -1 // Keeps it behind the main sprite
        })
    }
    //% block="shake screen for $duration ms with intensity $intensity"
    //% duration.min=50 duration.max=2000
    //% intensity.min=1 intensity.max=10
    export function screenShake(duration: number, intensity: number) {
        let endTime = game.runtime() + duration
        game.onUpdate(function () {
            if (game.runtime() < endTime) {
                scene.cameraShake(intensity, 50)
            }
        })
    }
    //% block="flash $sprite for $duration ms"
    //% sprite.shadow=variables_get
    //% duration.min=50 duration.max=1000
    export function flash(sprite: Sprite, duration: number) {
        let original = sprite.image.clone()
        let flashImage = sprite.image.clone()
        flashImage.replace(1, 15) // Turn white
        sprite.setImage(flashImage)
        pause(500)
            sprite.setImage(original)
    }
    //% block="apply glitch effect to $sprite"
    //% sprite.shadow=variables_get
    export function glitchEffect(sprite: Sprite) {
        game.onUpdateInterval(200, function () {
            let img = sprite.image.clone()
            for (let i = 0; i < 5; i++) {
                img.setPixel(randint(0, img.width - 1), randint(0, img.height - 1), randint(1, 15))
            }
            sprite.setImage(img)
        })
    }
    //% block="collapse sprite into itself $sprite"
    //% sprite.shadow=variables_get
    export function screenCollapse(sprite: Sprite) {
        let img = sprite.image.clone()
        let centerX = img.width >> 1
        let centerY = img.height >> 1

        game.onUpdateInterval(200, function () {
            let newImg = img.clone()
            for (let x = 0; x < img.width; x++) {
                for (let y = 0; y < img.height; y++) {
                    let dx = x - centerX
                    let dy = y - centerY
                    let angle = Math.atan2(dy, dx) + Math.PI / 12 // Slight spin
                    let radius = Math.sqrt(dx * dx + dy * dy) * 0.9 // Shrinking inwards

                    let newX = Math.round(centerX + Math.cos(angle) * radius)
                    let newY = Math.round(centerY + Math.sin(angle) * radius)

                    if (newX >= 0 && newX < img.width && newY >= 0 && newY < img.height) {
                        newImg.setPixel(x, y, img.getPixel(newX, newY))
                    }
                }
            }
            sprite.setImage(newImg)
        })
    }
    //% block="apply color out of space to $sprite"
    //% sprite.shadow=variables_get
    export function colorOutOfSpace(sprite: Sprite) {
        game.onUpdateInterval(150, function () {
            let img = sprite.image.clone()
            for (let i = 0; i < 10; i++) {
                let x = randint(0, img.width - 1)
                let y = randint(0, img.height - 1)
                let color = img.getPixel(x, y)
                img.setPixel(x, y, 15 - color) // Invert color
            }
            sprite.setImage(img)
        })
    }
    //% block="apply entity distortion to $sprite"
    //% sprite.shadow=variables_get
    export function entityDistortion(sprite: Sprite) {
        game.onUpdateInterval(200, function () {
            let img = sprite.image.clone()
            let offsetX = randint(-2, 2)
            let offsetY = randint(-2, 2)

            let newImg = img.clone()
            for (let x = 0; x < img.width; x++) {
                for (let y = 0; y < img.height; y++) {
                    let newX = x + offsetX
                    let newY = y + offsetY
                    if (newX >= 0 && newX < img.width && newY >= 0 && newY < img.height) {
                        newImg.setPixel(newX, newY, img.getPixel(x, y))
                    }
                }
            }
            sprite.setImage(newImg)
        })
    }
    //% block="apply anomaly breakdown to $sprite"
    //% sprite.shadow=variables_get
    export function anomalyBreakdown(sprite: Sprite) {
        game.onUpdateInterval(100, function () {
            let img = sprite.image.clone()
            for (let i = 0; i < 5; i++) {
                let x = randint(0, img.width - 1)
                let y = randint(0, img.height - 1)
                img.setPixel(x, y, 0) // Set to transparent
            }
            sprite.setImage(img)
        })
    }
    //% block="apply dripping shadow to $sprite"
    //% sprite.shadow=variables_get
    export function drippingShadow(sprite: Sprite) {
        game.onUpdateInterval(100, function () {
            let img = sprite.image.clone()

            // Create the "drip" effect
            for (let x = 0; x < img.width; x++) {
                for (let y = img.height - 1; y > 0; y--) {
                    if (img.getPixel(x, y - 1) > 0 && Math.percentChance(20)) {
                        img.setPixel(x, y, img.getPixel(x, y - 1)) // Copy pixel down
                        img.setPixel(x, y - 1, 0) // Erase original to create "drip"
                    }
                }
            }

            sprite.setImage(img)
        })
    }
    //% block="glitch warp $sprite"
    //% sprite.shadow=variables_get
    export function glitchWarp(sprite: Sprite) {
        let img = sprite.image.clone()
        let frames = 10 // Number of "glitch frames"

        game.onUpdateInterval(100, function () {
            if (frames > 0) {
                let offsetX = Math.randomRange(-3, 3)
                let offsetY = Math.randomRange(-3, 3)

                let glitchImg = img.clone()

                // Shift horizontal slices randomly
                for (let y = 0; y < glitchImg.height; y += 2) {
                    let shift = Math.randomRange(-5, 5)
                    for (let x = 0; x < glitchImg.width; x++) {
                        let color = img.getPixel((x + shift + glitchImg.width) % glitchImg.width, y)
                        glitchImg.setPixel(x, y, color)
                    }
                }

                // Randomly invert colors
                if (Math.percentChance(30)) {
                    for (let x = 0; x < glitchImg.width; x++) {
                        for (let y = 0; y < glitchImg.height; y++) {
                            let color = glitchImg.getPixel(x, y)
                            glitchImg.setPixel(x, y, 15 - color) // Invert colors
                        }
                    }
                }

                // Randomly "teleport" sprite
                if (Math.percentChance(15)) {
                    sprite.setPosition(
                        sprite.x + Math.randomRange(-10, 10),
                        sprite.y + Math.randomRange(-10, 10)
                    )
                }

                sprite.setImage(glitchImg)
                frames--
            } else {
                sprite.setImage(img) // Reset to normal after glitching
            }
        })
    }
    //% block="temporal echo $sprite"
    //% sprite.shadow=variables_get
    export function temporalEcho(sprite: Sprite) {
        let echoes: Sprite[] = []
        let maxEchoes = 5 // Number of echoes
        let decayRate = 50 // How quickly echoes fade

        game.onUpdateInterval(100, function () {
            // Create a new echo
            let echo = sprites.create(sprite.image.clone(), SpriteKind.Food)
            echo.setPosition(sprite.x, sprite.y)
            echo.setFlag(SpriteFlag.Ghost, true) // Prevent interaction
            echoes.push(echo)

            // Slowly fade echoes
            for (let i = 0; i < echoes.length; i++) {
                let fadeAmount = Math.max(0, 15 - (i * 3)) // Decrease brightness per echo
                echoes[i].image.replace(15, fadeAmount) // Simulate fading effect
            }

            // Limit number of echoes
            if (echoes.length > maxEchoes) {
                echoes[0].destroy()
                echoes.shift()
            }
        })
    }
    //% block="glitch pulse $sprite"
    //% sprite.shadow=variables_get
    export function glitchPulse(sprite: Sprite) {
        game.onUpdateInterval(100, function () {
            let img = sprite.image.clone()

            // Randomly shift pixels in small areas
            for (let i = 0; i < 10; i++) {
                let x = randint(0, img.width - 2)
                let y = randint(0, img.height - 2)

                let color1 = img.getPixel(x, y)
                let color2 = img.getPixel(x + 1, y + 1)

                img.setPixel(x, y, color2)
                img.setPixel(x + 1, y + 1, color1)
            }

            // Randomly invert some pixels
            for (let i = 0; i < 5; i++) {
                let x = randint(0, img.width - 1)
                let y = randint(0, img.height - 1)
                img.setPixel(x, y, randint(1, 15)) // Assign random color
            }

            sprite.setImage(img)
        })
    }
    //% block="glitch distort $sprite"
    //% sprite.shadow=variables_get
    export function glitchDistort(sprite: Sprite) {
        game.onUpdateInterval(100, function () {
            let img = sprite.image.clone()

            // Randomly shift small pixel regions
            for (let i = 0; i < 10; i++) {
                let x = randint(0, img.width - 2)
                let y = randint(0, img.height - 2)

                let color1 = img.getPixel(x, y)
                let color2 = img.getPixel(x + 1, y + 1)

                img.setPixel(x, y, color2)
                img.setPixel(x + 1, y + 1, color1)
            }

            // Randomly insert glitchy pixels
            for (let i = 0; i < 5; i++) {
                let x = randint(0, img.width - 1)
                let y = randint(0, img.height - 1)
                img.setPixel(x, y, randint(1, 15)) // Assigns random colors
            }

            sprite.setImage(img) // Updates sprite image with corruption effect
        })
    }
    // Block for MakeCode extension
    //% block="stretch $sprite horizontally $scaleX vertically $scaleY"
    //% scaleX.defl=2 scaleY.defl=2
    //%sprite.shadow=variables_get
   export function stretch(sprite: Sprite, scaleX: number, scaleY: number) {
        stretchSprite(sprite, scaleX, scaleY)
    }
    // Function to stretch a sprite
    function stretchSprite(sprite: Sprite, scaleX: number, scaleY: number) {
        let img = sprite.image
        let newWidth = img.width * scaleX
        let newHeight = img.height * scaleY
        let newImg = image.create(newWidth, newHeight)

        for (let x = 0; x < newWidth; x++) {
            for (let y = 0; y < newHeight; y++) {
                let srcX = Math.floor(x / scaleX)
                let srcY = Math.floor(y / scaleY)
                newImg.setPixel(x, y, img.getPixel(srcX, srcY))
            }
        }

        sprite.setImage(newImg)
    }
    //%block="apply old Fashion TV glitch effect"
    export function s(): void {
    
let ScreenCopy = image.create(160, 120)
let F = 1
let mySprite2 = sprites.create(ScreenCopy, SpriteKind.Player)
game.onUpdate(function () {
if (Math.percentChance(100)) {
            for (let x3 = 0; x3 <= 159; x3++) {
                for (let y5 = 0; y5 <= 119; y5++) {
                    if (Math.percentChance(50)) {
                        ScreenCopy.setPixel(x3, y5, 1)
                    } else {
                        ScreenCopy.setPixel(x3, y5, 15)
                    }
                }
    }

}
})
    }
}