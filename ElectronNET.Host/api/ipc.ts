import { ipcMain, BrowserWindow, BrowserView, webContents } from 'electron';
import { Socket } from 'net';
let electronSocket;

export = (socket: Socket) => {
    electronSocket = socket;
    socket.on('registerIpcMainChannel', (channel) => {
        ipcMain.on(channel, (event, args) => {
            event.preventDefault();
            electronSocket.emit(channel, [args]);
        });
    });

    socket.on('registerIpcMainChannelWithId', (channel) => {
        ipcMain.on(channel, (event, args) => {
            event.preventDefault();
            let wcId = event.sender.id;
            let wc = webContents.fromId(wcId)
            let bw = BrowserWindow.fromWebContents(wc);
            electronSocket.emit(channel, { id: bw.id, args: [args] });
        });
    });

    socket.on('registerSyncIpcMainChannel', (channel) => {
        ipcMain.on(channel, (event, args) => {
            const x = <any>socket;
            x.removeAllListeners(channel + 'Sync');
            socket.on(channel + 'Sync', (result) => {
                event.returnValue = result;
            });
            event.preventDefault();
            electronSocket.emit(channel, [args]);
        });
    });

    socket.on('registerOnceIpcMainChannel', (channel) => {
        ipcMain.once(channel, (event, args) => {
            event.preventDefault();
            electronSocket.emit(channel, [args]);
        });
    });

    socket.on('removeAllListenersIpcMainChannel', (channel) => {
        ipcMain.removeAllListeners(channel);
    });

    socket.on('sendToIpcRenderer', (browserWindow, channel, ...data) => {
        const window = BrowserWindow.fromId(browserWindow.id);

        if (window) {
            window.webContents.send(channel, ...data);
        }
    });

    socket.on('sendToIpcRendererBrowserView', (id, channel, ...data) => {
        const browserViews: BrowserView[] = (global['browserViews'] = global['browserViews'] || []) as BrowserView[];
        let view: BrowserView = null;
        for (let i = 0; i < browserViews.length; i++) {
            if (browserViews[i]['id'] === id) {
                view = browserViews[i];
                break;
            }
        }

        if (view) {
            view.webContents.send(channel, ...data);
        }
    });
};
