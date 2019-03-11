const {app, BrowserWindow} = require('electron');
const path = require('path');
const url = require('url');
const content = require('./resources/content.json');
const ipc = require('electron').ipcMain

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
let statusApp = {
	value: 'init',
	label: 'Inicializando aplicación cliente.',
	data: null
};

const isSecondInstance = app.makeSingleInstance((commandLine, workingDirectory) => {
	if (mainWindow) {
		if(mainWindow.isMinimized()) mainWindow.restore();
		mainWindow.focus();
	}
});

if (isSecondInstance) app.quit();

let createWindow = () => {
	// Create the browser window.
	mainWindow = new BrowserWindow({
		//width: 800,
		//height: 600,
		icon: path.join(__dirname, './resources/coppel.icns'),
		frame: false
		//titleBarStyle: 'customButtonsOnHover'
		//titleBarStyle: 'hidden'
	});

	mainWindow.setFullScreen(true);
	mainWindow.show();

	// and load the index.html of the app.
	mainWindow.loadURL(url.format({
		pathname: path.join(__dirname, 'app/index.html'),
		protocol: 'file:',
		slashes: true
	}));

	// Open the DevTools.
	//mainWindow.webContents.openDevTools();

	// Emitted when the window is closed.
	mainWindow.on('closed', () => {
		// Dereference the window object, usually you would store windows
		// in an array if your app supports multi windows, this is the time
		// when you should delete the corresponding element.
		mainWindow = null;
	});

	mainWindow.webContents.once('dom-ready', () => {
		mainWindow.webContents.send('callFunction', 'initFullRender', undefined);
	});

	ipc.on('render-finished', (event, arg) => {
		//mexicanada del timeout con 10ms
		setTimeout(() => {
			mainWindow.webContents.send('callFunction', 'onChangeStatus', statusApp);

			setTimeout(()=>{
				statusApp.value = 'connecting';
				statusApp.label = 'Conectando al servidor.';
				statusApp.data = null;
				mainWindow.webContents.send('callFunction', 'onChangeStatus', statusApp);

				setTimeout(()=>{
					statusApp.value = 'connected';
					statusApp.label = 'Conexión establecida con el servidor.';
					statusApp.data = null;
					mainWindow.webContents.send('callFunction', 'onChangeStatus', statusApp);

					setTimeout(()=>{
						statusApp.value = 'get-content';
						statusApp.label = 'Solicitud de configuración.';
						statusApp.data = null;
						mainWindow.webContents.send('callFunction', 'onChangeStatus', statusApp);

						setTimeout(()=>{
							statusApp.value = 'verify-content';
							statusApp.label = 'Verificando multimedia.';
							statusApp.data = null;
							mainWindow.webContents.send('callFunction', 'onChangeStatus', statusApp);

							setTimeout(()=>{
								statusApp.value = 'queue';
								statusApp.label = 'Solicitud de descarga.';
								statusApp.data = null;
								mainWindow.webContents.send('callFunction', 'onChangeStatus', statusApp);

								setTimeout(()=>{
									statusApp.value = 'downloading';
									statusApp.label = 'Descargando multimedia 1/1.';
									statusApp.data = null;
									mainWindow.webContents.send('callFunction', 'onChangeStatus', statusApp);

									setTimeout(()=>{
										statusApp.value = 'ready';
										statusApp.label = '';
										statusApp.data = content;
										mainWindow.webContents.send('callFunction', 'onChangeStatus', statusApp);
									}, 500);
								}, 500);
							}, 500);
						}, 500);
					}, 500);
				}, 500);	
			}, 500);			
		}, 10);
	});
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
	// On macOS it is common for applications and their menu bar
	// to stay active until the user quits explicitly with Cmd + Q
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', () => {
	// On macOS it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (mainWindow === null) {
		createWindow();
	}
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
