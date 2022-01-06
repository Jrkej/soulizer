var uploaded = null
var url = null
let options = ["Colored", "Fill", "Invert", "Reverse"]

function preload() {
    const params = new URLSearchParams(window.location.search);
    var name = "./assets/default.mp3"
    if (params.get('fill') == 'true' || params.get('fill') == 'false') {
        nofill = true;
        if (params.get('fill') == 'true') nofill = false;
    }
    if (params.get('nofill') == 'true' || params.get('nofill') == 'false') {
        nofill = false;
        if (params.get('nofill') == 'true') nofill = true;
    }
    if (params.get('colored') == 'true' || params.get('colored') == 'false') {
        colored = false;
        if (params.get('colored') == 'true') colored = true;
    }
    if (params.get('bw') == 'true' || params.get('bw') == 'false') {
        colored = true;
        if (params.get('bw') == 'true') colored = false;
    }
    if (params.get('invert') == 'true' || params.get('invert') == 'false') {
        inv = false;
        if (params.get('invert') == 'true') inv = true;
    }
    if (params.get('reverse') == 'true' || params.get('reverse') == 'false') {
        rev = false;
        if (params.get('reverse') == 'true') rev = true;
    }
    console.log("Settings - colored : ", colored, ", fill : ", !nofill, ", invert : ", inv, " reverse : ", rev)
    loadOptions()

    if (params.get('url') != null) {
        name = params.get('url')
    }
    song = loadSound(name)
    console.log(song)
    let l = name.split("/");
    document.getElementById("title").innerHTML = l[l.length - 1];
}

function loadOptions() {
    console.log("Adding Options")
    var checked = [colored, !nofill, inv, rev]
    let div = document.getElementById("options")

    for (var i = 0; i < options.length; i++) {
        let p = document.createElement("p")
        let input = document.createElement("input")
        let lb = document.createElement("label")
        let p2 = document.createElement("p")
        let option = options[i];
        p.innerHTML = option + ":&nbsp"
        if (i > 0) p.innerHTML = "&nbsp&nbsp&nbsp&nbsp" + p.innerHTML
        input.type = "checkbox"
        input.id = option
        input.className = "checkbox"
        input.checked = checked[i]
        lb.htmlFor = option
        lb.className = "toggle"
        p2.innerHTML = "&nbsp&nbsp On &nbsp&nbsp&nbsp&nbsp Off"
        p2.style = "color: snow;"
        lb.appendChild(p2)
        div.append(p)
        div.append(input)
        div.append(lb)
    }
}

function updateOptions() {
    colored = document.getElementById(options[0]).checked
    nofill = !document.getElementById(options[1]).checked
    inv = document.getElementById(options[2]).checked
    rev = document.getElementById(options[3]).checked
}

function handleFiles(event) {
    var files = event.target.files;
    uploaded = files[0]
    url = URL.createObjectURL(uploaded)
    console.log(url)
}

function redirect(html) {
    let opt = ""
    let upl = document.getElementById("url").value
    console.log(upl)
    if (upl != null && upl != "Paste Url of song(optional)" && upl != "") {
        opt = "?url="+upl
    }
    window.location = html + opt;
}

async function serve() {
    stop()
    if(url == null) {
        alert("Choose a file first.")
        return null;
    }
    song = await loadSound(url)
    console.log(song)
    document.title = uploaded['name']
    reload()
    document.getElementById("upload").files = [];
}

document.getElementById("upload").addEventListener("change", handleFiles, false);