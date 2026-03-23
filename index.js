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
function updateLibraryIcons() {
    let currentTrack = currentSong.src.split("/songs/")[1];

    document.querySelectorAll(".song-list li").forEach(li => {
        let track = li.getAttribute("data-track");
        let icon = li.querySelector(".playicon img");

        if (track === currentTrack && !currentSong.paused) {
            icon.src = "assets/pause.svg";
        } else {
            icon.src = "assets/play.svg";
        }
    });
}

const playMusic = (track) => {
    // let audio = new Audio("/songs/" + track)
    currentSong.src = "/songs/" + track
    currentSong.play()
    play.src = "assets/pause.svg"
    // Update the song name in the playbar
    let songinfo = track.replaceAll("%20", " ").replaceAll("%5BFrom Ranabaali%5D", "").replace(".mp3", "").replaceAll("(pagalall.com)", "")
    console.log(songinfo);
    document.querySelector(".songinfo .songName").innerText = songinfo
    updateLibraryIcons(); // sync
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
    // Adding event listeners to play icons
    Array.from(document.querySelector(".song-list").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", () => {
            const track = e.getAttribute("data-track");

            // 1. Check if the clicked song is ALREADY the loaded song
            if (currentSong.src.includes(track)) {
                // If it's the same song, toggle play/pause
                if (currentSong.paused) {
                    currentSong.play();
                    e.querySelector(".playicon img").src = "assets/pause.svg";
                    play.src = "assets/pause.svg"; // Updates the main bottom playbar
                } else {
                    currentSong.pause();
                    e.querySelector(".playicon img").src = "assets/play.svg";
                    play.src = "assets/play.svg"; // Updates the main bottom playbar
                }
            } else {
                // 2. If it's a completely new song, play it from the start
                playMusic(track);

                // Reset all other library icons back to 'play'
                document.querySelectorAll(".song-list .playicon img").forEach(img => {
                    img.src = "assets/play.svg";
                });
                // Set the newly clicked song's icon to 'pause'
                e.querySelector(".playicon img").src = "assets/pause.svg";
            }
        });
    });
    //Add event listener to play and pause
    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play()
            play.src = "assets/pause.svg"
        }
        else {
            currentSong.pause()
            play.src = "assets/play.svg"
        }
    })
    currentSong.addEventListener("play", updateLibraryIcons);
    currentSong.addEventListener("pause", updateLibraryIcons);
}
main()