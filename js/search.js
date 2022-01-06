const api = "dba0f30367msh4d70a295f4e1e52p179d63jsn6c0b1aa26c7f"

const xhr = new XMLHttpRequest();
const xhr2 = new XMLHttpRequest();

xhr2.addEventListener("readystatechange", function () {
	if (this.readyState === this.DONE) {
        let url = JSON.parse(this.responseText)["link"]
        console.log(url)
        song = loadSound(url)
        console.log(song)
        document.getElementById("title").innerHTML = JSON.parse(this.responseText)["title"];
    }
});


async function loadLink(query) {
    xhr.open("GET", "https://youtube-search-results.p.rapidapi.com/youtube-search/?q="+query.split(' ').join('+'));
    xhr.setRequestHeader("x-rapidapi-host", "youtube-search-results.p.rapidapi.com");
    xhr.setRequestHeader("x-rapidapi-key", api);
    xhr.send();
    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === this.DONE) {
            let id = JSON.parse(this.responseText)["items"][0]["id"]
            xhr2.open("GET", "https://youtube-mp36.p.rapidapi.com/dl?id="+id);
            xhr2.setRequestHeader("x-rapidapi-host", "youtube-mp36.p.rapidapi.com");
            xhr2.setRequestHeader("x-rapidapi-key", api);
            xhr2.send();
        }
    });
}