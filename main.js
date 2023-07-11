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
let isPlaying = false;
let isOnSlider = false;

window.onload = e => {
    pauseSvg.style.display = "none";
    slider.min = 0;
    slider.max = video.duration;
    slider.value = 0;
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
}, 1)

setInterval(() => {
    timeElapsed.innerHTML = "00:0"+Math.floor(video.currentTime) +" / 00:0"+ Math.floor(video.duration);
}, 1000)