function initGame () {
    state = {
        gameHasStarted: true,
        secondsLeft: 5,
        sounds: [],
        maxSoundLevel: 0
    }
}


function writeToScreen () {
    // OLED.clear()
    if (!(state.gameHasStarted)) {
        OLED12864_I2C.showString(0,0,"Salut Helikoner,",2)
        // OLED.writeStringNewLine("Indraznesti sa ma trezesti ?")
    } else {
        // OLED.writeStringNewLine("Putere " + state.maxSoundLevel.toString())
        if (state.secondsLeft > 0) {
            // OLED.writeStringNewLine("Mai ai " + state.secondsLeft.toString() + " secunde")
        } else {
            if (state.maxSoundLevel < requiredPower) {
                // OLED.writeStringNewLine("GAME OVER Helikoner")
            } else {
                // OLED.writeStringNewLine("AI TREZIT DRAGONUL !!!")
                // OLED.writeStringNewLine("esti un Helikoner puternic !!!")
            }
        }
    }
}
let soundLevel = 0
let requiredPower = 0
let avgMaxSound = 0
requiredPower = 10
let sampleRate = 100
let selectedSouds = 15
serial.redirectToUSB()
let state: {
    gameHasStarted: boolean,
    sounds: number[],
    secondsLeft: number,
    maxSoundLevel: number
} = {
    gameHasStarted: false,
    secondsLeft: 5,
    sounds: [],
    maxSoundLevel: 0
}
//OLED.init(128, 64)
OLED12864_I2C.init(60)
OLED12864_I2C.showString(
    0,
    0,
    "Hello!",
    1);
writeToScreen()
forever(() => {
    if (input.buttonIsPressed(Button.A)) {
        initGame();
    }
})
loops.everyInterval(1000, function () {
    if (!(state.gameHasStarted) || state.secondsLeft == 0) {
        return;
    }
    if (state.secondsLeft > 0) {
        state.secondsLeft--;
    }
    writeToScreen()
})
loops.everyInterval(sampleRate, function () {
    if (!(state.gameHasStarted)) {
        return;
    }
    soundLevel = input.soundLevel()
    state.sounds.push(soundLevel)
    led.plotBarGraph(
    soundLevel,
    255
    )
})
loops.everyInterval(100, function () {
    if (!(state.gameHasStarted)) {
        return;
    }
    state.sounds.sort()
state.sounds = state.sounds.slice(-selectedSouds)
avgMaxSound = state.sounds.reduce((a, b) => a + b, 0) / state.sounds.length
    avgMaxSound = parseInt(avgMaxSound.toString())
    state.maxSoundLevel = avgMaxSound
if (avgMaxSound > state.maxSoundLevel) {
        writeToScreen()
    }
})
