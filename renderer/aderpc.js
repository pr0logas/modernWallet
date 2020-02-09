const {ipcRenderer} = require("electron");
const Client = require('bitcoin-core');
const request = require('request');

const adeptiod = new Client({
        network: 'regtest',
        host: 'localhost',
        username: 'adeptiouser',
        password: 'au0uXT1793xzUXnxaPknPyBJK2ATEslL',
        port: '9078',
        timeout: '30000'
});

module.exports = adeptiod