// console.log("Spotify Clone");
let currentSong = new Audio()
async function getSongs() {
    let a = await fetch("http://127.0.0.1:5500/songs/")
    let response = await a.text()
    let div = document.createElement("div")
    div.innerHTML = response
    // console.log(response);
    let as = div.getElementsByTagName("a")
    let songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split("/songs/")[1])
        }
    }
    return songs
}
const playMusic = (track)=>{
    // let audio = new Audio("/songs/" + track)
    currentSong.src = "/songs/" + track
    currentSong.play()
    play.src = "assets/pause.svg"
}
async function main() {
    let songs = await getSongs()
    // console.log(songs);
    // let audio = new Audio("http://127.0.0.1:5500/songs/" + songs[0])
    // audio.play()

    let songUL = document.querySelector(".song-list").getElementsByTagName("ul")[0]
    for (const song of songs) {
        const songName = song.replaceAll("%20", " ").replaceAll("%5BFrom Ranabaali%5D", "").replace(".mp3", "").replaceAll("(pagalall.com)", "")
        songUL.innerHTML += `<li data-track="${song}">
            <img src="assets/music.svg" alt="music" class="song-icon">
            <div class="Info">
                <p class="song-name">${songName}</p>
                <p class="artist-name">KARTIK</p>
            </div>
            <div class="playicon">
                <img src="assets/play.svg" alt="play" width="20">
            </div>
        </li>`  
    }
    // Adding event listeners to play icons
    Array.from(document.querySelector(".song-list").getElementsByTagName("li")).forEach(e=>{
        e.addEventListener("click",()=>{
            const track = e.getAttribute("data-track")
            console.log("Playing:", track.replaceAll("%20"," ").replace(".mp3", ""))
            playMusic(track)
        })
    })
    //Add event listener to play and pause
    play.addEventListener("click",()=>{
        if(currentSong.paused){
            currentSong.play()
            play.src = "assets/pause.svg"
        }
        else{
            currentSong.pause()
            play.src = "assets/play.svg"
        }
    })
}
main()