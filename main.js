const dropdownBtns = document.querySelectorAll(".dropdown-btn")
const openFile = document.getElementById("open-file");
const closeBtn = document.getElementById("close-button");
const video = document.getElementById("video");
const timeElapsed = document.getElementById("time-elapsed");
const slider = document.getElementById("slider")
const skipStart = document.getElementById("skip-start");
const reverse = document.getElementById("reverse");
const playPause = document.getElementById("play-pause");
const fastFoward = document.getElementById("fast-foward");
const skipEnd = document.getElementById("skip-end");
const playSvg = document.getElementById("play-svg");
const pauseSvg = document.getElementById("pause-svg");
const pipBtn = document.getElementById("pip-btn");
const captionsBtn = document.getElementById("captions-btn");
const playbackBtn = document.getElementById("playback-btn");
const fullscreenBtn = document.getElementById("fullscreen-btn");
const volumeBtn = document.getElementById("volume-btn");
const muteSvg = document.getElementById("mute-svg");
const lowVolumeSvg = document.getElementById("volume-low-svg");
const loudVolumeSvg = document.getElementById("volume-loud-svg");
const volumeSlider = document.getElementById("volumeSlider");
const infoBtn = document.getElementById("info-btn");
const infoPopup = document.getElementById("info-popup");
const closeInfo = document.getElementById("close-info-popup");
const titleP = document.getElementById("title-p");
const extensionP = document.getElementById("extension-p");
const typeP = document.getElementById("type-p");
const sizeP = document.getElementById("size-p");
const dateP = document.getElementById("date-p");
const durationP = document.getElementById("duration-p");
const captions = video.textTracks[0];
let hasVideo = false;
let isMute = false;
let isPlaying = false;
let isOnSlider = false;
let isPictureInPicture = false;
let activeDropdown = null;
let volume = 1;


function togglePip() {
    if (isPictureInPicture) {
         document.exitPictureInPicture();
         isPictureInPicture = false;
    } else {
         video.requestPictureInPicture();
         isPictureInPicture = true;
    }
 }
 
 function togglePlay() {
    if (video.src == ""){
        alert("Please select a item to be played first");
    } else {
        if (isPlaying == false){
            isPlaying = true;
            video.play();
            playSvg.style.display = "none";
            pauseSvg.style.display = "block";
        } else {
            isPlaying = false;
            video.pause();
            pauseSvg.style.display = "none";
            playSvg.style.display = "block";
        }
    }
}

function toggleFullscreen() {
    if (document.fullscreenElement != null) {
        document.exitFullscreen();
    } else {
        video.requestFullscreen();
    }
}

function resetSlider(){
    slider.min = 0;
    slider.value = 0;
    slider.max = video.duration;
}

function convertToTimeFormat(seconds){
    let hours = 0;
    let minutes =  0;
    
    while (seconds > 59) {
        minutes += 1;
        seconds -= 60;
    }
    while (minutes > 59) {
        hours += 1;
    }
    
    hours = Math.round(hours);
    minutes = Math.round(minutes);
    seconds = Math.round(seconds);

    if (hours < 1) {
        hours = "";
    } else if (hours < 10) {
        hours = "0" + hours + ":";
    } else {
        hours = hours + ":"
    }
    if (minutes < 1) {
        minutes = "00:";
    } else if (minutes < 10) {
        minutes = "0" + minutes + ":";
    } else {
        minutes = minutes + ":";
    }
    if (seconds < 10){
        seconds = "0" + seconds;
    }
    return hours + minutes  + seconds;
}

window.onload = e => {
    pauseSvg.style.display = "none";
    resetSlider();
    activeDropdown = null;
    loudVolumeSvg.style.display = "block";
    slider.value = 0;
    volumeSlider.value = 100;
    hasVideo = false;
}

window.onclick = e => { 
    if (activeDropdown != null) {
        const dropdownClicked = activeDropdown.contains(e.target);
        if (!dropdownClicked) {
            activeDropdown.style.display = "none";
            activeDropdown = null;
        }
    }
}

window.onkeyup = e => {
    switch(e.key.toLowerCase()) {
        case " ":
        case "k":
            togglePlay();
            break;
        case "f":
            toggleFullscreen();
            break;
        case "p":
            togglePip();
            break;
    }
}

openFile.onchange = e => {
    const file = e.target.files[0];
    video.src = URL.createObjectURL(file);
    hasVideo = true;
    const name = file.name.split(".");
    titleP.value = name[0];
    extensionP.value = `.${name[name.length -1]}`
    dateP.value = file.lastModifiedDate;
    sizeP.value = `${(file.size / 102400).toFixed(2)}mb`;
    typeP.value = file.type;
    resetSlider();
}

video.onloadedmetadata = e => {
    durationP.value = convertToTimeFormat(video.duration);
}

dropdownBtns.forEach((button) => {
    button.onclick = e => {
        document.getElementById(button.dataset.menu).style.display = "flex";
        setTimeout(() => {
            activeDropdown = document.getElementById(button.dataset.menu);
        }, 1);
    }
})

closeBtn.onclick = e => {
    video.src = "";
    slider.value = 0;
    hasVideo = false;
    pauseSvg.style.display = "none";
    playSvg.style.display = "block";

}

slider.ontouchstart = e => {
    isOnSlider = true;
}

slider.ontouchend = e => {
    isOnSlider = false;
}

slider.onmousedown = e => {
    isOnSlider = true;
}

slider.onmouseup = e => {
    isOnSlider = false;
}

skipStart.onclick = e => {
    video.currentTime = 0;
}

reverse.onclick = e => {
    video.currentTime -= video.duration / 10;
} 

playPause.onclick = e => {
    togglePlay();
}

fastFoward.onclick = e => {
    video.currentTime += video.duration / 10;
}

skipEnd.onclick = e => {
    video.currentTime = video.duration;
}

setInterval(() => {
        if (hasVideo) {
                if (isOnSlider){
                    video.currentTime = video.duration * (slider.value / 100);
                } else {
                    slider.value = (video.currentTime / video.duration) * 100;
                }
                if (video.currentTime == video.duration){
                    if (isPlaying) {
                        pauseSvg.style.display = "none";
                        playSvg.style.display = "block";
                        isPlaying = false;
                    }
                }
            }
        }, 1)

setInterval(() => {
    if (hasVideo){
        timeElapsed.innerHTML = convertToTimeFormat(video.currentTime) + " / " + convertToTimeFormat(video.duration);
    } else {
        timeElapsed.innerHTML = "00:00 / 00:00";
    }
    if (video.volume == 0) {
        muteSvg.style.display = "block";
        lowVolumeSvg.style.display = "none";
        loudVolumeSvg.style.display = "none";
    } else if (video.volume < 0.5) {
        muteSvg.style.display = "none";
        lowVolumeSvg.style.display = "block";
        loudVolumeSvg.style.display = "none";
    } else {
        muteSvg.style.display = "none";
        lowVolumeSvg.style.display = "none";
        loudVolumeSvg.style.display = "block";
    }
}, 100)


for (let i = 0; i < video.textTracks.length; i++) {
    video.textTracks[i].mode = "hidden";
}

captionsBtn.onmousedown = e => {
    if (captions == null) {
        alert("There are no captions available for this video");
    } else {
        const isHidden = captions.mode === "hidden";
        captions.mode = isHidden ? "showing" : "hidden";
    }
}

playbackBtn.onmousedown = e => {
    let speed = video.playbackRate + 0.25;
    if (speed > 2) speed = 0.25;
    video.playbackRate = speed;
    playbackBtn.innerHTML = `${speed}x`
}

pipBtn.onmousedown = e => {
    togglePip();
}


fullscreenBtn.onmousedown = e => {
    toggleFullscreen();
}


volumeBtn.onclick = e => {
    if (isMute) {
        video.volume = volume;
        volumeSlider.value = volume * 100;
        isMute = false;
    } else {
        volume = video.volume;
        video.volume = 0;
        volumeSlider.value = 0;
        isMute = true;
    }
}

volumeSlider.onchange = e => {
    video.volume = volumeSlider.value * 0.01;
}

infoBtn.onmousedown = e => {
    infoPopup.style.display = "block";
}

closeInfo.onmousedown = e => {
    infoPopup.style.display = "none";
}