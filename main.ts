
serial.redirectToUSB()
OLED.init(128, 64)
let state : {
    gameHasStarted:boolean,
    sounds:number[],
    secondsLeft:number,
    maxSoundLevel:number
} = {
    gameHasStarted:false,
    secondsLeft:3,
    sounds:[],
    maxSoundLevel:0
}
let sampleRate = 100;
let selectedSouds = 15;

function initGame(){
    state = {
        gameHasStarted: true,
        secondsLeft:15,
        sounds: [],
        maxSoundLevel: 0
    }
}

forever(()=>{
    if (input.buttonIsPressed(Button.A)) {
        initGame();
    }
})
loops.everyInterval(1000, function () {
    if (!state.gameHasStarted || state.secondsLeft==0) {
        return;
    }
    if (state.secondsLeft>0){
        state.secondsLeft--;
    }
    writeToScreen();
})
loops.everyInterval(sampleRate, function () {
    if (!state.gameHasStarted) {
        return;
    }
    let soundLevel = input.soundLevel()
    state.sounds.push(soundLevel)
    led.plotBarGraph(
    soundLevel,
    255
    )
})
function writeToScreen() {
    OLED.clear()
    if (!state.gameHasStarted) {
        OLED.writeStringNewLine('Salut Helikoner, indraznesti sa ma trezesti ?');
    }else{
        if (state.secondsLeft > 0){
            OLED.writeStringNewLine(state.maxSoundLevel.toString())
            OLED.writeStringNewLine("Mai ai "+state.secondsLeft.toString() +" secunde")
        }else{
            if (state.maxSoundLevel < 100) {
                OLED.writeStringNewLine("GAME OVER Helikoner")
            }
            else {
                OLED.writeStringNewLine("AI TREZIT DRAGONUL, esti un Helikoner puternic 💪")
            }
            OLED.writeStringNewLine(state.maxSoundLevel.toString())
        }
    }
}
loops.everyInterval(100, function () {
    if(!state.gameHasStarted){
        return ;
    }
    state.sounds.sort()
    state.sounds = state.sounds.slice(-selectedSouds)
    let avgMaxSound = state.sounds.reduce((a, b) => a + b, 0) / state.sounds.length;
    avgMaxSound = parseInt(avgMaxSound.toString())
    state.maxSoundLevel = avgMaxSound
    if (avgMaxSound > state.maxSoundLevel) {
        writeToScreen();
    }
})
