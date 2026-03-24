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
        if (track === currentTrack && !currentSong.ended) {
            icon.src = "assets/play.svg";
        }
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
    //change the time of the song in the playbar
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
    // Update progress bar as the song plays
    currentSong.addEventListener("timeupdate", () => {
        let progress = (currentSong.currentTime / currentSong.duration) * 100;
        document.querySelector(".progress").style.width = progress + "%"
    })
    // update the time of the song in the playbar
    currentSong.addEventListener("timeupdate", () => {
        if (!isNaN(currentSong.duration)) {
            let currentMinutes = Math.floor(currentSong.currentTime / 60);
            let currentSeconds = Math.floor(currentSong.currentTime % 60);
            let durationMinutes = Math.floor(currentSong.duration / 60);
            let durationSeconds = Math.floor(currentSong.duration % 60);
            document.querySelector(".songtime").innerText = `${currentMinutes}:${currentSeconds.toString().padStart(2, '0')} / ${durationMinutes}:${durationSeconds.toString().padStart(2, '0')}`
        }
        else {
            document.querySelector(".songtime").innerText = `0:00 / 0:00`
        }
    })
    // Seekbar functionality
    document.querySelector(".seekbar").addEventListener("click", (e) => {
        const seekBar = e.currentTarget;
        const rect = seekBar.getBoundingClientRect();
        const pos = (e.clientX - rect.left) / rect.width;
        currentSong.currentTime = pos * currentSong.duration;
    });
    let isDragging = false;
    let wasPlaying = false;
    const seekbar = document.querySelector(".seekbar");
    // Start dragging
    seekbar.addEventListener("mousedown", () => {
        isDragging = true;
        wasPlaying = !currentSong.paused;

        // Pause while dragging
        currentSong.pause();
    });
    // Stop dragging
    document.addEventListener("mouseup", () => {
        isDragging = false;
        // Resume playback if it was playing before dragging
        if (wasPlaying) {
            currentSong.play();
        }
        document.querySelector(".progress").classList.remove("no-transition");
    });
    // Drag movement
    document.addEventListener("mousemove", (e) => {
        if (!isDragging) return;
        const rect = seekbar.getBoundingClientRect();
        let pos = (e.clientX - rect.left) / rect.width;
        // Clamp between 0 and 1 (IMPORTANT)
        pos = Math.max(0, Math.min(1, pos));
        currentSong.currentTime = pos * currentSong.duration;
        document.body.style.userSelect = "none"; // Prevent text selection while dragging
    });
    seekbar.addEventListener("mousedown", (e) => {
        isDragging = true;
        const rect = seekbar.getBoundingClientRect();
        let pos = (e.clientX - rect.left) / rect.width;
        pos = Math.max(0, Math.min(1, pos));
        currentSong.currentTime = pos * currentSong.duration;
        document.querySelector(".progress").classList.add("no-transition");
    });
    // adding functionality to the next button
    document.getElementById("next").addEventListener("click", () => {
        let currentTrack = currentSong.src.split("/songs/")[1];
        let currentIndex = songs.indexOf(currentTrack);
        let nextIndex = (currentIndex + 1) % songs.length;
        playMusic(songs[nextIndex]);
    });
    // adding event listener to the previous button
    document.getElementById("previous").addEventListener("click",()=>{
        let currentTrack = currentSong.src.split("/songs/")[1];
        let currentIndex = songs.indexOf(currentTrack);
        let previousIndex = (currentIndex - 1 + songs.length) % songs.length;
        playMusic(songs[previousIndex]);
    })
}
main()