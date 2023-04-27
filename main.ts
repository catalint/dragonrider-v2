input.onButtonPressed(Button.A, function () {
    if (state.gameHasStarted) {
        state.gameHasStarted = false;
writeToScreen()
    } else {
        initGame()
    }
})
function initGame () {
    state = {
        gameHasStarted: true,
        secondsLeft: 5,
        sounds: [],
        maxSoundLevel: 0
    }
writeToScreen()
}
function writeToScreen () {
    OLED12864_I2C.clear()
    if (!(state.gameHasStarted)) {
        OLED12864_I2C.showString(
        0,
        1,
        "  HELIKON,",
        2
        )
        OLED12864_I2C.showString(
        0,
        2,
        " LA ATAC !!!",
        4
        )
    } else {
        OLED12864_I2C.showString(
        0,
        0,
        " PUTEREA TA",
        2
        )
        OLED12864_I2C.showString(
        0,
        1,
        "  -- " + state.maxSoundLevel.toString() + " -- ",
        0
        )
        if (state.secondsLeft > 0) {
            OLED12864_I2C.showString(
            0,
            2,
            "  TIMP: " + state.secondsLeft.toString() + "",
            0
            )
        } else {
            if (state.maxSoundLevel < requiredPower) {
                OLED12864_I2C.showString(
                0,
                2,
                " GAME OVER",
                2
                )
                OLED12864_I2C.showString(
                0,
                3,
                "Helikoner",
                2
                )
                times = 3
                while (times) {
                    music.playSoundEffect(music.createSoundEffect(WaveShape.Sine, 1056, 1481, 255, 0, 200, SoundExpressionEffect.None, InterpolationCurve.Logarithmic), SoundExpressionPlayMode.UntilDone)
                    times += -1
                }
            } else {
                OLED12864_I2C.showString(
                0,
                2,
                " AI SPERIAT ",
                0
                )
                OLED12864_I2C.showString(
                0,
                3,
                " DRAGONUL !!!",
                0
                )
                times2 = 3
                while (times2) {
                    music.playSoundEffect(music.createSoundEffect(WaveShape.Sawtooth, 3367, 178, 255, 0, 421, SoundExpressionEffect.None, InterpolationCurve.Logarithmic), SoundExpressionPlayMode.UntilDone)
                    times2 += -1
                }
            }
        }
    }
    OLED12864_I2C.zoom(true)
}
let soundLevel = 0
let times2 = 0
let times = 0
let requiredPower = 0
let avgMaxSound = 0
requiredPower = 100
let sampleRate = 200
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
// OLED.init(128, 64)
OLED12864_I2C.init(60)
writeToScreen()
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
    let numberOfSoundsRecorded = state.sounds.length
    avgMaxSound = state.sounds.reduce((a, b) => a + b, 0) / numberOfSoundsRecorded
    avgMaxSound = parseInt(avgMaxSound.toString())
    state.maxSoundLevel = avgMaxSound
if (avgMaxSound > state.maxSoundLevel) {
        writeToScreen()
    }
})
