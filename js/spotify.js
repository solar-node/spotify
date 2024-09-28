console.log("lets write javascript");
// Global variables 
let currentSong = new Audio;
let songs ;
let currFolder;
function formatSecondsToMMSS(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00"
    }
    // Calculate minutes and seconds
    const totalMinutes = Math.floor(seconds / 60);
    const totalSeconds = Math.round(seconds % 60);

    // Format minutes and seconds to always be two digits
    const formattedMinutes = String(totalMinutes).padStart(2, '0');
    const formattedSeconds = String(totalSeconds).padStart(2, '0');

    // Return the formatted time in "MM:SS" format
    return `${formattedMinutes}:${formattedSeconds}`;
}




async function getSongs(folder) {
    currFolder = folder;
    let a = await fetch(`${folder}/`)  //This willv get you to the songs foldder
    let response = await a.text();

    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    songs = []

    for (let index = 2; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1])
            // console.log( songs.push(element.href.split("/songs/")[1]))
        }
    }

    // Shows all the songs in playlist
    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0]
    songUL.innerHTML = ""
    for (const song of songs) {
        // songUL.innerHTML = songUL.innerHTML +  `<li>${song.replaceAll("%20", "  ")}</li>` ;   
        songUL.innerHTML = songUL.innerHTML + `<li><img class="invert" src="img/music.svg" alt="">
                                        <div class="info"> 
                                            <div>${song.replaceAll("%20", " ")}</div>
                                            <div>Aditya</div>
                                        </div>
                                        <div class="playNow">
                                            <span>Play now</span>
                                            <img class="invert w-20" src="img/play.svg" alt="">
                                        </div>
                                    </li>`;
    }

        // Attach an event listner to each song
        Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
            e.addEventListener("click", element => {
    
                console.log(e.querySelector(".info").firstElementChild.innerHTML)
                playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
            })
    
        })
        return songs
}
const playMusic = (track, pause = false) => {
    // let audio= new Audio("/songs/" + track)
    currentSong.src = `/${currFolder}/` + track
    if (!pause) {
        currentSong.play()
        play.src = "img/pause.svg"
    }
    document.querySelector(".songInfo").innerHTML = decodeURI(track)
    document.querySelector(".songTime").innerHTML = "00:00/00:00"

} 

// Function to show all the albums
async function displayAlbums() {
    console.log("displaying albums")
    let a = await fetch(`songs/`)  //This will get you to the songs foldder
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a")
    let album = document.querySelector(".album")
    let array = Array.from(anchors);
    // Array.from(anchors).forEach(async e => {

    for (let index = 0; index < array.length; index++) {
        const e = array[index];

        if (e.href.includes("/songs/") && !e.href.includes(".htaccess")) {
            let folder = (e.href.split("/songs/").slice(-1)[0])
            console.log(e.href.split("/songs/").slice(-1)[0]);

            //    Get  the metadata of the folder
            let a = await fetch(`/songs/${folder}/info.json`)
            let response = await a.json();
            console.log(response)
            album.innerHTML = album.innerHTML + ` <div data-folder="${folder}" class="card  card1 ">
                               
                                    <div class="img1 ">
                                        <div class="playGreen">
                                            <img  src="img/playGreen.svg" alt="">
                                    </div>
                                        <img class="rounded-20"
                                            src="/songs/${folder}/cover.png"
                                            alt="">
                                        <div class="songName flex column ">${response.title}
                                            <div class="singer">
                                                <div>
                                                    <a href="/">${response.singer1},</a>
                                                    <a href="/">${response.singer2},</a>
                                                </div>
                                                <div>
                                                    <a class="" href="/">J${response.singer3},</a>
                                                    <a class="" href="/">J${response.singer4},</a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div> `
        }
    }
    // })
    // Load the playlist whenever the card is clicked
    Array.from(document.getElementsByClassName("card")).forEach(e => { 
        e.addEventListener("click", async item => {
            console.log("Fetching Songs")
            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)            
            playMusic(songs[0])

        })
    })
}




async function main() {

    // Get the list of all the songs
    await getSongs("songs/ncs")
    playMusic(songs[0], true)

    // Display all the albums on  the page
    await displayAlbums()


    // Attach an event listner to play next and previous
    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play()
            play.src = "img/pause.svg"
        }
        else {
            currentSong.pause()
            play.src = "img/play.svg"
        }

    })

    // Listen fot time update event
    currentSong.addEventListener("timeupdate", () => {
        // console.log(currentSong.currentTime, currentSong.duration);
        document.querySelector(".songTime").innerHTML = `${formatSecondsToMMSS(currentSong.currentTime)}/
      ${formatSecondsToMMSS(currentSong.duration)}`
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%"
    })

    //Event listen for seekbar
    document.querySelector(".seekbar").addEventListener("click", (e) => {
        let songPercent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = songPercent + "%";
        currentSong.currentTime = ((currentSong.duration) * songPercent) / 100;
    })

    //  Add an event listner to hamburger
    document.querySelector(".hamburger").addEventListener("click", (e) => {
        document.querySelector(".left").style.left = "0"

    })
    // Add an event listner to close hamburger
    document.querySelector(".close").addEventListener("click", (e) => {
        document.querySelector(".left").style.left = "-100%"
        document.querySelector(".left").style.transition = "all 1s"

    })

    //   Add an event listner to previous 
    previous.addEventListener("click", (e) => {
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if ((index - 1) >= 0) {
            playMusic(songs[index - 1])
        }

    }
    )


    //   Add an event listner to next 
    next.addEventListener("click", (e) => {
        currentSong.pause()
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])

        // console.log(songs.length)
        if ((index + 1) < songs.length) {
            playMusic(songs[index + 1])
        }
    })

    // Add an  event to volume range
    document.querySelector(".volRange").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        console.log("setting volume to", e.target.value, "/100")
        currentSong.volume = parseInt(e.target.value) / 100

    }
    )


    // Add event listner to mute the track
    document.querySelector(".volume>img ").addEventListener("click", (e) => {
        console.log(e.target);
        if (e.target.src.includes("img/volume.svg")) {
            e.target.src = e.target.src.replace("img/volume.svg", "img/mute.svg")
            currentSong.volume = 0;
            document.querySelector(".volRange").getElementsByTagName("input")[0].value = 0;
        }
        else {
            e.target.src = e.target.src.replace("img/mute.svg", "img/volume.svg")
            currentSong.volume = .1;
            document.querySelector(".volRange").getElementsByTagName("input")[0].value = .1;
        }


    }
    )


}





main()