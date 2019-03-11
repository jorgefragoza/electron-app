const videoPlayer = document.getElementById('video-player');

let isPlaying = false;
let onPlayer = false;

videoPlayer.onended = () => {
    exit();
};

const play = (src) => {
    videoPlayer.pause();
    videoPlayer.src = src;
    videoPlayer.load();
    videoPlayer.play();
    isPlaying = true;

    onPlayer = true;
}

const pause = () => {
    videoPlayer.pause();
    isPlaying = false;
};

const continuePlay = () => {
    videoPlayer.play();
    isPlaying = true;
};

const exit = () => {
    videoPlayer.pause();
    videoPlayer.src = null;
    onPlayer = false;
    EventHandler.publish(new events.toMenu());
};

const spacePress = () => {
    if (isPlaying) pause();
    else continuePlay();
};

const forward = () => {
    let videoDuration = videoPlayer.seekable.end(0);
    let currentTime = videoPlayer.currentTime;
    let totalForward = videoDuration/100;
    currentTime += totalForward;
    if (currentTime > videoDuration) currentTime = videoDuration;
    videoPlayer.currentTime = currentTime;
};

const backward = () => {
    let videoDuration = videoPlayer.seekable.end(0);
    let currentTime = videoPlayer.currentTime;
    let totalBackward = videoDuration/100;
    currentTime -= totalBackward;
    if (currentTime < 0) currentTime = 0;
    videoPlayer.currentTime = currentTime;
};

const addEventKey = (element, eventName, callback) => {
    if (element.addEventListener)
        element.addEventListener(eventName, callback, false);
    else if (element.attachEvent)
        element.attachEvent("on" + eventName, callback);
    else
        element["on" + eventName] = callback;
};


addEventKey(document.body, 'keydown', (e) => {
    switch(e.code) {
      case 'Escape':
        if (onPlayer) exit();
        break;
      case 'Space':
        if (onPlayer) spacePress();
        break;
      case 'ArrowRight':
        if (onPlayer) forward();
        break;
      case 'ArrowLeft':
        if (onPlayer) backward();
        break;
    }
});

EventHandler.subscribe(events.play, (urlVideo) => {
    play(urlVideo);
});