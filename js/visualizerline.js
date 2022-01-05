var song
var fft
var neons = []
var nofill = true
var vol = 1

function preload() {
    const params = new URLSearchParams(window.location.search);
    var name = "./assets/default.mp3"
    if (params.get('url') != null) {
        name = params.get('url')
    }
    if (params.get('name') != null) {
        name = params.get('name')
        loadLink(name)
    }
    else {
        song = loadSound(name)
        console.log(song)
        document.getElementById("title").innerHTML = "default.mp3";
    }
}

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
    fft.analyze()
    energy = fft.getEnergy(20, 200)
    background(max(0, min(120, 255-energy)))
    stroke(energy)
    if (nofill) noFill()
    else fill(255)
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

