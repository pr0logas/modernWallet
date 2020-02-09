const {app, ipcMain, BrowserWindow, ipcRenderer} = require('electron')
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

var xhr = new XMLHttpRequest();

xhr.open("POST", 'https://explorer.adeptio.cc/search', true);
xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
xhr.send(JSON.stringify({
    search: '8d88f4253e1d230b489b28cc3a8765d148f918cff52d011f7b3bc203ff1000ed'
}))