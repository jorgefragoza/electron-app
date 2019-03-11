const views = ['DASHBOARD', 'MENU', 'PLAYER']; 
let currentView = { index: 0 };
let hiddenComponents = {};
let cache;

const componentsRender = [].slice.call(body.childNodes).filter((e) => {
    if (e.getAttribute) {
        return e.getAttribute('view') !== null;
    }
    return false;
});

const checkRender = () => {
    componentsRender.forEach((component) => {
        if (component.nodeName === views[currentView.index]) {
            let showComponent = hiddenComponents[component.nodeName];
            delete hiddenComponents[component.nodeName];
            body.appendChild(showComponent || component);
        } else {
            if (!hiddenComponents[component.nodeName]) {
                hiddenComponents[component.nodeName] = component;
                body.removeChild(component);
            }
        }
    });
};

//Observer
Object.defineProperty(currentView, "index", {
    get : () => {
      return this._index;
    },
    set: (val) => {
        this._index = val;
        checkRender();
    }
});

EventHandler.subscribe(events.init, (label) => {
    if (currentView.index !== 0)
        currentView.index = 0;
    EventHandler.publish(new events.changeLabel(label));
});

EventHandler.subscribe(events.ready, (content) => {
    currentView.index = 1;
    cache = content;
    EventHandler.publish(new events.setContent(content));
});

EventHandler.subscribe(events.selectVideo, (url) => {
    currentView.index = 2;
    EventHandler.publish(new events.play(url));
});

EventHandler.subscribe(events.toMenu, () => {
    currentView.index = 1;
    EventHandler.publish(new events.setContent(cache));
});