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
        OLED12864_I2C.showString(0, 1,"  HELIKON,",2)
        OLED12864_I2C.showString(0,2," LA ATAC !!!",4)
    } else {
        OLED12864_I2C.showString(0, 0, " PUTEREA TA")
        OLED12864_I2C.showString(0,1,"  -- " + state.maxSoundLevel.toString() +  " -- ")
        if (state.secondsLeft > 0) {
            OLED12864_I2C.showString(0, 2,"  TIMP: " + state.secondsLeft.toString() + "")
        } else {
            if (state.maxSoundLevel < requiredPower) {
                OLED12864_I2C.showString(0, 2, " GAME OVER")
                OLED12864_I2C.showString(0, 3, "Helikoner")
            } else {
                OLED12864_I2C.showString(0, 2," AI SPERIAT ")
                OLED12864_I2C.showString(0, 3," DRAGONUL !!!")
            }
        }
    }
    OLED12864_I2C.zoom(true)
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
writeToScreen()
input.onButtonPressed(Button.A,()=>{
    if (state.gameHasStarted){
        state.gameHasStarted = false;
        writeToScreen()
    }
    else{
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
avgMaxSound = state.sounds.reduce((a, b) => a + b, 0) / (state.sounds.length || 1)
    avgMaxSound = parseInt(avgMaxSound.toString())
    state.maxSoundLevel = avgMaxSound
if (avgMaxSound > state.maxSoundLevel) {
        writeToScreen()
    }
})
