let maxSound = 0
serial.redirectToUSB()
OLED.init(128, 64)
let sounds: number[] = []
let sample_rate = 100;
let selected_souds = 15;
loops.everyInterval(sample_rate, function () {

    let soundLevel = input.soundLevel()
    sounds.push(soundLevel)
    led.plotBarGraph(
    soundLevel,
    255
    )
})
loops.everyInterval(100, function () {
    // sounds.sort()
    // sounds = sounds.slice(-selected_souds)
    // let avgMaxSound = sounds.reduce((a, b) => a + b, 0) / sounds.length;

    // if (input.buttonIsPressed(Button.A)) {
    //     basic.showNumber(avgMaxSound)
    // } else {
    //     if (avgMaxSound > maxSound) {
    //         maxSound = avgMaxSound
    //         OLED.clear()
    //         OLED.writeStringNewLine(soundLevel.toString())
    //     }
    // }
})
