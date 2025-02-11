artist = []
function createSongCard(id,banner,songName,artistName){
    let div = document.createElement("div");
    div.innerHTML = `<div class="song-card">
                        <div class="song-card-image">
                            <img width="154" src=${"artworks/" + banner + ".jpg"} alt="" />
                        </div>
                        <div class="song-info">
                            <button id=${id} class="song-card-play">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
                                <path
                                d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80L0 432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z"
                                />
                            </svg>
                            </button>
                            <h5>${songName}</h5>
                            <p>Single • ${artistName}</p>
                        </div>
                    </div>`
                    
    document.querySelector(".song-cards-container").appendChild(div);
}
function footerSongCard(banner,songName,artistName){
    
    let div = document.querySelector(".footer-song-info-container")
    div.innerHTML = `<img src="${"artworks/" + banner + ".jpg"}" alt="" />
                    <div class="footer-song-info">
                    <div class="footer-song-name">
                        <h5><a href="">${songName}</a></h5>
                        <p>${artistName}</p>
                    </div>
                    <button class="footer-add-to-playlist">
                        <svg
                        data-encore-id="icon"
                        role="img"
                        aria-hidden="true"
                        viewBox="0 0 16 16"
                        class="Svg-sc-ytk21e-0 dYnaPI"
                        >
                        <path
                            d="M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13zM0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8z"
                        ></path>
                        <path
                            d="M11.75 8a.75.75 0 0 1-.75.75H8.75V11a.75.75 0 0 1-1.5 0V8.75H5a.75.75 0 0 1 0-1.5h2.25V5a.75.75 0 0 1 1.5 0v2.25H11a.75.75 0 0 1 .75.75z"
                        ></path>
                        </svg>
                    </button>
                    </div>`

}
function createArtistGrid(src,name){
    let div = document.createElement("div");
    div.innerHTML =`<div class="artist-container">
                        <img width="48" src="artists/${src}.jpg" alt="" />
                        <h4>${name}</h4>
                    </div>`
    document.querySelector(".artist-grid").appendChild(div);
}

function createRecentSongs(banner,songName,artistName){
    let div = document.createElement("div");
    div.innerHTML =`<div class="recent-container">
                        <img src=${"artworks/" + banner + ".jpg"} alt="" />
                        <div class="recent-info">
                            <h5>${songName}</h5>
                            <p>Album • ${artistName}</p>
                        </div>
                    </div>`
    document.querySelector(".recent-song").appendChild(div);
}


async function main() {

    let fetchingartist = await fetch("http://127.0.0.1:3000/artists/")
    let artistResponse =  await fetchingartist.text();
    
    
    let artists = document.createElement("div")
    artists.innerHTML = artistResponse
    let artistSrc = artists.getElementsByTagName("a")
    // console.log(artistSrc)
    
    
    let artist = []
    for (let index =0; index<artistSrc.length; index++){
        const element = artistSrc[index];
        if (element.href.endsWith(".jpg")){
            artist.push(element.innerText.replace(".jpg" , ""))
        } 
    }
    
    for (let index = 0; index < artist.length; index++) {
        const element = artist[index];
        const src = element.replaceAll(" ", "%20")
        const name = element.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
        createArtistGrid(src, name)
    }
    
    let fetchingSongs =  await fetch("http://127.0.0.1:3000/songs/")
    let songResponse =  await fetchingSongs.text();
    
    let songs = document.createElement("div")
    songs.innerHTML = songResponse
    let song = songs.getElementsByTagName("a")
    
    links = []
    songInfo =[]
    for (let index =0; index<song.length; index++){
        const element = song[index];
        if (element.href.endsWith(".mp3")){
            links.push(element.href)
            songInfo.push(element.innerText.replace(".mp3" , ""))
        } 
    }
    
    for (let index = 0; index < songInfo.length; index++) {
        const element = songInfo[index];
        const banner = encodeURIComponent(element.split(" - ")[0])
        const songName = element.split(" - ")[0] 
        const artistName = element.split(" - ")[1]
        createSongCard(index,banner,songName,artistName) 
        createRecentSongs(banner,songName,artistName) 
    }
    
}
main()

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60); // Get minutes
    const secs = Math.floor(seconds % 60);    // Get seconds

    // Format seconds to always show two digits
    const formattedSecs = secs < 10 ? `0${secs}` : secs;

    return `${minutes}:${formattedSecs}`;
}

let audio = new Audio(); // Initialize audio globally
let isPlaying = false;
let updateInterval;

document.querySelector(".song-cards-container").addEventListener("click", (event) => {
    if (event.target.closest(".song-card-play")) {
        let button = event.target.closest(".song-card-play");
        console.log(button.id);
        
        // Stop previous audio
        if (!audio.paused) {
            audio.pause();
        }

        // Set new song source and play
        audio.src = links[parseInt(button.id)];
        audio.play();
        isPlaying = true;

        // Update Play Button Icon
        updatePlayButton();

        document.querySelectorAll(".song-card-play").forEach((btn) => {
            btn.innerHTML = `<svg data-encore-id="icon" role="img" aria-hidden="true" viewBox="0 0 16 16" class="Svg-sc-ytk21e-0 dYnaPI">
                                <path d="M3 1.713a.7.7 0 0 1 1.05-.607l10.89 6.288a.7.7 0 0 1 0 1.212L4.05 14.894A.7.7 0 0 1 3 14.288V1.713z"></path>
                             </svg>`;
        });

        // Update only the clicked play button
        button.innerHTML = `<svg data-encore-id="icon" role="img" aria-hidden="true" class="Svg-sc-ytk21e-0 dYnaPI e-9541-icon" viewBox="0 0 16 16">
                                <path d="M2.7 1a.7.7 0 0 0-.7.7v12.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7H2.7zm8 0a.7.7 0 0 0-.7.7v12.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7h-2.6z"></path>
                            </svg>`;

        let  element = songInfo[parseInt(button.id)];
        let banner = encodeURIComponent(element.split(" - ")[0])
        let songName = element.split(" - ")[0] 
        let artistName = element.split(" - ")[1]
        footerSongCard(banner,songName,artistName)

        // Clear existing interval to avoid multiple updates
        clearInterval(updateInterval);
        updateInterval = setInterval(updateTimestamp, 500);
    }
});

function updateTimestamp() {
    let timeStamp = document.querySelector(".timestamp-bar");
    let percentage = (audio.currentTime / audio.duration) * 100;
    timeStamp.style.width = percentage < 4 ? "3.5%" : `${percentage}%`;

    document.querySelector(".start-time").innerText = formatTime(audio.currentTime);
    document.querySelector(".duration-time").innerText = formatTime(audio.duration);

    if (audio.currentTime === audio.duration) {
        audio.currentTime = 0;
        isPlaying = false;
        updatePlayButton();
    }
}

function updatePlayButton() {
    let div = document.querySelector(".play-btn");
    div.innerHTML = isPlaying
        ? `<svg data-encore-id="icon" role="img" aria-hidden="true" class="Svg-sc-ytk21e-0 dYnaPI e-9541-icon" viewBox="0 0 16 16"><path d="M2.7 1a.7.7 0 0 0-.7.7v12.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7H2.7zm8 0a.7.7 0 0 0-.7.7v12.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7h-2.6z"></path></svg>`
        : `<svg data-encore-id="icon" role="img" aria-hidden="true" viewBox="0 0 16 16" class="Svg-sc-ytk21e-0 dYnaPI"><path d="M3 1.713a.7.7 0 0 1 1.05-.607l10.89 6.288a.7.7 0 0 1 0 1.212L4.05 14.894A.7.7 0 0 1 3 14.288V1.713z"></path></svg>`;
}

function playAndPause(){
    let bool = false;
    
    
    document.querySelector(".play-btn").addEventListener("click", ()=>{
        
        console.log(bool)
        
        bool = !bool
        if (bool){
            audio.play()
            setInterval(()=>{
                let persontage = (Math.floor(audio.currentTime)) / (Math.floor(audio.duration)) * 100;
                console.log(Math.floor(persontage))
                let timeStamp = document.querySelector(".timestamp-bar")
                if(audio.currentTime == audio.duration){
                    audio.currentTime = 0;
                    document.querySelector(".play-btn").click()
                }
                if (persontage < 4){
                    timeStamp.style.width = `3.5%`    
                }
                else{
                    timeStamp.style.width = `${persontage}%`    
                }
            },500)
        }else{
            audio.pause()
        }
        
        let div = document.querySelector(".play-btn")
        
        if (!bool){
            // shows play button 
            div.innerHTML = `<svg data-encore-id="icon" role="img" aria-hidden="true" viewBox="0 0 16 16" class="Svg-sc-ytk21e-0 dYnaPI"><path d="M3 1.713a.7.7 0 0 1 1.05-.607l10.89 6.288a.7.7 0 0 1 0 1.212L4.05 14.894A.7.7 0 0 1 3 14.288V1.713z"></path></svg>`
        } else{
            // shows pause button
            div.innerHTML = `<svg data-encore-id="icon" role="img" aria-hidden="true" class="Svg-sc-ytk21e-0 dYnaPI e-9541-icon" viewBox="0 0 16 16"><path d="M2.7 1a.7.7 0 0 0-.7.7v12.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7H2.7zm8 0a.7.7 0 0 0-.7.7v12.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7h-2.6z"></path></svg>`
        }
    })
}

let slider = document.querySelector(".timestamp-bar-container")

slider.addEventListener("click",(e)=>{
    let rect = slider.getBoundingClientRect()
    let clickX = e.clientX - rect.left
    let sliderWidth = rect.width
    let value = (clickX / sliderWidth) * 100 
    let newCurrentTime = (audio.duration * value) / 100
    audio.currentTime = newCurrentTime
})


let volumeSlider = document.querySelector(".volume-bar-container")
let volumeBar = document.querySelector(".volume-bar")

volumeSlider.addEventListener("click",(e)=>{
    let rect = volumeSlider.getBoundingClientRect()
    let clickX = e.clientX - rect.left
    let volumeSliderWidth = rect.width
    let value = (clickX / volumeSliderWidth) * 100
    if (value < 16){
        volumeBar.style.width = `16%`    
    }
    else{
        volumeBar.style.width = `${value}%`    
    }

    audio.volume = (value / 100)
})


let a = setInterval(()=>{
    let current_Time = document.querySelector(".start-time")
    current_Time.innerText = `${formatTime(audio.currentTime)}`
    let duration_Time = document.querySelector(".duration-time")
    duration_Time.innerText = `${formatTime(audio.duration)}`
},500)
playAndPause()