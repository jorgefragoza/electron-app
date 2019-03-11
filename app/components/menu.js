const container = document.getElementById('container');

let onMenu = false;

let listFull = {
    list: [],
    back: null
};

let liveList = [];
let backList = [];
let currentOption = {};

Object.defineProperty(currentOption, "index", {
    get : () => {
      return this._index;
    },
    set: (val) => {
      this._index = val;
      let maxIndex = document.getElementById('list').getElementsByTagName('li').length-1;
      if (val > maxIndex) this._index = maxIndex;
      if (val < 0) this._index = 0;
      setFocus(this._index);
    }
});

// Functions
const setFocus = (index) => {
    document.getElementById('list').getElementsByTagName('li')[index].getElementsByTagName('a')[0].focus();
};

const selectVideo = (url) => {
  onMenu = false;
  EventHandler.publish(new events.selectVideo(url));
};

const initBackground = (images) => {
    let listImages = [];
    let current = 0;
    let last = 0;
    images.forEach((list) => {
      list.files.forEach((img) => {
        listImages.push(`${list.downloaddirectory}/${img.name}`);
      });
    });
    last = listImages.length;
    if (listImages.length > 0) container.style.backgroundImage = `url(${listImages[current]})`;
    setInterval(() => {
      container.style.backgroundImage = `url(${listImages[current]})`;
      current++;
      if (current === last) current = 0;
    }, 10000);
};

const addElementToList = (element, key, event) => {
    let li = document.createElement("li");
    let a = document.createElement("a");
    a.setAttribute('id', key);
    a.setAttribute('onclick', event);
    a.setAttribute('href', '#');
    a.appendChild(document.createTextNode(key));
    li.appendChild(a);
    element.appendChild(li);
    //totalOptions = document.getElementById('list').getElementsByTagName('li').length;
};

const initList = () => {
    let list = document.getElementById('list');
    list.innerHTML = '';
    listFull.back = [];
    liveList = JSON.parse(JSON.stringify(listFull));
    liveList.list.forEach((e) => {
      addElementToList(list, e.title, e.event);
    });
    document.getElementById('list').getElementsByTagName('li')[0].getElementsByTagName('a')[0].focus();
    currentOption.index = 0;
};

const next = (indice) => {
    let list = document.getElementById('list');
    list.innerHTML = '';
    backList = JSON.parse(JSON.stringify(liveList));
    liveList = liveList.list[indice].childrens;
    liveList.back = backList;
    liveList.list.forEach((e) => {
      addElementToList(list, e.title, e.event);
    });
    currentOption.index = 0;
};

const back = () => {
    let list = document.getElementById('list');
    list.innerHTML = '';
    liveList = JSON.parse(JSON.stringify(liveList.back));
    liveList.list.forEach((e) => {
      addElementToList(list, e.title, e.event);
    });
    currentOption.index = 0;
};

const onChangePlaylist = (params) => {
    let content = params;
    let element = new Object();
    listFull = { list: [], back: null };
    element.title = 'Videos';
    element.event = 'next(0);';
    element.childrens = {list: [], back: null};
    element.childrens.list.push({title: '..', event: 'back()'});
    let listVideos = content['video'];
    let index = 1;
    listVideos.forEach((e) => {
      let fullPath = e.downloaddirectory.split('/');
      let step = fullPath[fullPath.length-1];
      let children = new Object();
      children.title = step;
      children.event = 'next(' + index + ');';
      index++;
      children.childrens = {list: [], back: null};
      children.childrens.list.push({title: '..', event: 'back()'});
      e.files.forEach((v) => {
        let child = new Object();
        child.title = v.name;
        child.event = `selectVideo('${e.downloaddirectory}/${v.name}')`;
        children.childrens.list.push(child);
      });
      element.childrens.list.push(children);
    });
    listFull.list.push(element);
    initList();
    initBackground(content.image);
};

const addEvent = (element, eventName, callback) => {
    if (element.addEventListener) {
        element.addEventListener(eventName, callback, false);
    } else if (element.attachEvent) {
        element.attachEvent("on" + eventName, callback);
    } else {
        element["on" + eventName] = callback;
    }
};

addEvent(document.body, 'keydown', (e) => {
  switch(e.code) {
    case 'ArrowUp':
      if (onMenu) currentOption.index--;
      break;
    case 'ArrowDown':
      if (onMenu) currentOption.index++;
      break;
  }
});

EventHandler.subscribe(events.setContent, (content) => {
  onMenu = true;  
  onChangePlaylist(content);
});