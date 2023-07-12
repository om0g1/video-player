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
const volumeWrapper = document.getElementById("volume-wrapper");
const volumeSlider = document.getElementById("volume-slider");
let hasVideo = true;
let isPlaying = false;
let isOnSlider = false;
let activeDropdown = null;
let volume = 0.2;

window.onload = e => {
    pauseSvg.style.display = "none";
    slider.min = 0;
    slider.max = video.duration;
    slider.value = 0;
    activeDropdown = null;
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

openFile.onchange = e => {
    const file = e.target.files[0];
    video.src = URL.createObjectURL(file);
    hasVideo = true;
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

setInterval(() => {
    if (hasVideo){
        timeElapsed.innerHTML = convertToTimeFormat(video.currentTime) + " / " + convertToTimeFormat(video.duration);
    } else {
        timeElapsed.innerHTML = "00:00 / 00:00";
    }
}, 500)

volumeWrapper.onmousedown  = e => {
    const rect = e.target.getBoundingClientRect();
    let volumePercentage = Math.round((e.clientX - rect.right));
    volumeSlider.style.left = volumePercentage +"px";
    video.volume = 1 - (volumePercentage * -0.01);
}