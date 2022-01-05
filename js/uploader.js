var uploaded = null
var url = null

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

function serve() {
    stop()
    if(url == null) {
        alert("Choose a file first.")
        return null;
    }
    song = loadSound(url)
    console.log(song)
    document.title = uploaded['name']
    reload()
    document.getElementById("upload").files = [];
}

document.getElementById("upload").addEventListener("change", handleFiles, false);