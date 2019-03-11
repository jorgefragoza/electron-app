require('./run/event-handler');
const electron = require('electron');
const ipc = electron.ipcRenderer;
const body = document.getElementsByTagName('body')[0];
const head = document.getElementsByTagName('head')[0];
const fs = require('fs');
const events = require('./events');

const run = async () => {
    const engine = '/in';
    const view = '.html';
    const logic = '.js';
    const style = '.css';

    //read in
    let v = fs.readFileSync(__dirname + engine + view, 'utf8');

    //render in
    if(v) {
        //load in view
        body.innerHTML += v;
        //load in style
        let link = document.createElement('link');
        link.setAttribute('rel', 'stylesheet');
        link.setAttribute('type', 'text/css');
        link.setAttribute('href', __dirname + engine + style);
        head.appendChild(link);
        //load in logic
        let script = document.createElement('script');
        script.setAttribute('src', __dirname + engine + logic);
        body.appendChild(script);

        //get components to render in view
        let componentsRender = [].slice.call(body.childNodes).filter((e) => {
            if (e.getAttribute) {
                return e.getAttribute('view') !== null;
            }
            return false;
        });

        for (let component of componentsRender) {
            let pathView = component.getAttribute('view');

            let v = fs.readFileSync(__dirname + pathView + view, 'utf8');
            component.innerHTML += v;

            let script = document.createElement('script');
            script.setAttribute('type', 'text/javascript');
            script.setAttribute('src', __dirname + pathView + logic);
            head.appendChild(script);

            let link = document.createElement('link');
            link.setAttribute('rel', 'stylesheet');
            link.setAttribute('type', 'text/css');
            link.setAttribute('href', __dirname + pathView + style);
            component.appendChild(link);
        };

        ipc.send('render-finished', true);
    }
};

ipc.on('callFunction', async (event, functionName, functionParam) => {
    switch(functionName) {
        case 'initFullRender':
            await run();
            break;
        case 'onChangeStatus':
            let { value, label, data } = functionParam;
            if (value !== 'ready') {
                EventHandler.publish(new events.init(label));
            } else {
                EventHandler.publish(new events.ready(data));
            }
            break;
        case 'onChangePlayList':
            break;
    }
});