var song
var fft
var neons = []
var nofill = false
var vol = 1
var colored = false;
var inv = false;
var rev = false;


function setup() {
    document.body.style = "overflow-x: hidden;"
    createCanvas(windowWidth, windowHeight+20)
    fft = new p5.FFT()
    noLoop()
}

function reload() {
    createCanvas(windowWidth, windowHeight+20)
    fft = new p5.FFT()
    draw()
}

function draw() {
    updateOptions()
    fft.analyze()
    energy = fft.getEnergy(20, 200)
    let a = [min(255, energy), min(255, song._prevUpdateTime), max(0, 255-energy)]
    if (colored == false) a = [max(0, 255-energy), max(0, 255-energy), max(0, 255-energy)]
    if (inv) a = [255-a[0], 255-a[1], 255-a[2]]
    if (rev) a = [a[2], a[1], a[0]]

    background(a)
    stroke(255)
    if (nofill) noFill()
    else fill([255-a[0], 255-a[1], 255-a[2]])
    if (keyIsPressed && key == "ArrowLeft") {
        song.pauseTime = max(0, song.pauseTime-5)
        console.log("volume =", vol)
    }
    song.setVolume(document.getElementById("vol").value/100)
    var wave = fft.waveform()
    beginShape()
    for (var i = 0; i < width; i++) {
        var index = floor(map(i, 0, width, 0, wave.length))

        var x = i
        var y = wave[index] * document.getElementById("slider").value + height / 2;
        vertex(x, y)
    }
    endShape()
         
}

function fillSwap() {
    if (nofill) {
        document.getElementById("fill").innerHTML = "Don't Fill";
        nofill = false
    } else {
        document.getElementById("fill").innerHTML = "Fill";
        nofill = true
    }
}

function stop() {
    song.pause()
    noLoop()
    console.log("Paused")
}

function play() {
    song.play()
    loop()
    console.log("Playing")
}

function invert() {
    if (song.isPlaying()) {
        stop()
    } else {
        play()
    }
}

function mouseClicked(e) {
    let canvas = document.getElementById("defaultCanvas0")
    let r = canvas.getBoundingClientRect()

    if (e.clientX > r.x && e.clientX < r.x + r.width && e.clientY > r.y && e.clientY < r.y + r.height) {
        invert()
    }
}

