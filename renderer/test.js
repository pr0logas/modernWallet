const {ipcRenderer} = require("electron");
const Client = require('bitcoin-core');
const fs = require('fs');
const adeptiod = require("./aderpc.js")

//adeptiod.listAddressGroupings().then((data) => (data != "undefined") ? console.log(data) : console.log("listAccounts unknown"));
//adeptiod.command('listreceivedbyaddress', 1, true).then((response) => (response != "undefined") ? console.log(response) : console.log("listtransactions unknown"));
adeptiod.command('help').then((response) => console.log(response))

