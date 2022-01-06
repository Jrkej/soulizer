var needNeons = true
const neonsGenerations = 5
const firstGenerationNeons = 2000
const boostThreshold = 210
var song
var fft
var nofill = false
var neons = []
var colored = false;
var inv = false;
var rev = false;


function setup() {
    document.body.style = "overflow-x: hidden;"
    createCanvas(windowWidth, windowHeight+20)
    angleMode(DEGREES)
    fft = new p5.FFT()
    if (needNeons) {
        for (var i = 0; i < firstGenerationNeons; i++) {
            neons.push(new neon())
        }
    }
    noLoop()
}

function reload() {
    neons = []
    createCanvas(windowWidth, windowHeight+20)
    fft = new p5.FFT()
    if (needNeons) {
        for (var i = 0; i < firstGenerationNeons; i++) {
            neons.push(new neon())
        }
    }
    draw()
}

function draw() {
    updateOptions()
    let volume = document.getElementById("vol").value/100
    song.setVolume(volume)
    fft.analyze()
    energy = fft.getEnergy(20, 200) / volume
    let a = [min(255, energy), min(255, song._prevUpdateTime), max(0, 255-energy)]
    if (colored == false) a = [max(0, 255-energy), max(0, 255-energy), max(0, 255-energy)]
    if (inv) a = [255-a[0], 255-a[1], 255-a[2]]
    if (rev) a = [a[2], a[1], a[0]]

    background(a)
    stroke(255)
    if (nofill) noFill()
    else fill([255-a[0], 255-a[1], 255-a[2]])
    translate(width / 2, height / 2)

    var wave = fft.waveform()
    for (var m = -1; m <= 1; m+= 2) {
        beginShape()
        for (var i = 0; i <= 180; i++) {
            var index = floor(map(i, 0, width, 0, wave.length))

            var r = map(wave[index] / volume, -1, 1, 110, 350)
            var x = r * sin(i)
            var y = r * cos(i)
            vertex(x * m, y)
        }
        endShape()
    }
    
    if (needNeons && song.isPlaying()) {
        for (var i = 0; i < neonsGenerations; i++) {
            var n = new neon()
            neons.push(n)
        }
    }

    for (var i = 0; i < neons.length; i++) {
        if (neons[i].inCast()) {
            neons[i].update(energy > boostThreshold)
            neons[i].show()
        } else {
            neons.splice(i, 1)
        }
    }
}

function stop() {
    song.pause()
    noLoop()
    console.log("Paused")
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

class neon {
    constructor() {
        this.pos = p5.Vector.random2D().mult(230)
        this.vel = createVector(0, 0)
        this.acc = this.pos.copy().mult(random(0.0001, 0.00001))
        this.rad = random(3, 6)
        this.color = [random(0, 255), random(0, 255), random(0, 255)]
    }

    inCast() {
        if (this.pos.x < -width/2 || this.pos.x > width/2 || this.pos.y < -height/2 || this.pos.y > height/2) {
            return false
        }
        return true
    }

    update(boost) {
        if (song._playing == false) return null
        this.vel.add(this.acc)
        this.pos.add(this.vel)
        if (boost) {
            this.pos.add(this.vel)
            this.pos.add(this.vel)
            this.pos.add(this.vel)
        }
    }

    show() {
        noStroke()
        fill(this.color)
        ellipse(this.pos.x, this.pos.y, this.rad)
    }
}

function jump(sec) {
    let t = song.currentTime();
    console.log(t)
    t += sec
    t = max(0, min(t, song.duration()))
    song.jump(t)
}

function keyPressed() {
    if (key == "ArrowLeft") jump(-5)
    if (key == "ArrowRight") jump(5)
    if (key == ' ')  invert()
}