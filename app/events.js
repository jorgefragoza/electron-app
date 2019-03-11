class init {
    constructor(label) {
        this.label = label;
    }
}

class ready {
    constructor(data) {
        this.data = data;
    }
}

class changeLabel {
    constructor(label) {
        this.label = label;
    }
}

class setContent {
    constructor(content) {
        this.content = content;
    }
} 

class selectVideo {
    constructor(urlVideo) {
        this.urlVideo = urlVideo;
    }
}

class play {
    constructor(urlVideo) {
        this.urlVideo = urlVideo;
    }
}

class onEndedVideo {
    constructor() {}
}

class toMenu {
    constructor() {}
}

module.exports.init = init;
module.exports.ready = ready;
module.exports.changeLabel = changeLabel;
module.exports.setContent = setContent;
module.exports.selectVideo = selectVideo;
module.exports.play = play;
module.exports.onEndedVideo = onEndedVideo;
module.exports.toMenu = toMenu;