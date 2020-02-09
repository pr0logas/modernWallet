const adeptiod = require('./aderpc.js');
const {clipboard} = require('electron')
const fs = require('fs');
const os = require("os");
const {shell} = require('electron');

$(document).on('click', "#newGenKey", function() {
    adeptiod.command('masternode', 'genkey').then(
        (response) => (response != "undefined") ? $("#successNewGenKeyId").html(response) && playNewGenKey(response) : console.log("masternode genkey failed"));
    $("#successNewGenKey").removeClass("d-none");
});

function playNewGenKey(response) {
    var audio = document.getElementById("audioNewAddress");
    audio.play();
    clipboard.writeText(response)
    setTimeout(function() {
        $("#successNewGenKey").addClass("d-none")
    }, 60000)
}

$(document).on('click', "#newMnOutputs", function() {
    adeptiod.command('masternode', 'outputs').then(
        (response) => (response != "undefined") ? playMnOutputs(response) : console.log("masternode outputs failed"));
});

function playMnOutputs(response) {
    var audio = document.getElementById("audioNewAddress");
    audio.play();
    parseMnOutputs(response)
}

function parseMnOutputs(data) {
    var jsonContent = JSON.stringify(data);
    $("#MasterNodeOutputsData").html(jsonContent)
    $("#MasterNodeOutputs").modal("toggle");
}

var dataText = [];

$(document).on('submit', "#submitNewMasternode", function() {
    event.preventDefault();
    var data = [];
    $.each($(this).serializeArray(), function(key, value) {
        data[value['name']] = value['value'];
        $("#successNewMasterNodeName").html("<b>" + data['mnName'] + "</b>" + " Please, restart the wallet to apply new masternode.");
        writeUserOutput(data)
    });
});

var num = 0

function writeUserOutput(data) {
    num = num + 1;
    if (num === 5) {
        var dataText = (data['mnName'] + " " + data['mnIP'] + " " + data['mnPrivKey'] + " " + data['mnOutput'] + " " + data['mnOutputID'] + os.EOL);
        num = 0;

        fs.readFile(process.resourcesPath + "/apidata/currentAdeDir.json", 'utf8', function(err, data) {
            masternodeFile = (data + "masternode.conf")
            $("#successNewMasterNode").removeClass("d-none");
            playNewMasternode();
            $("#newMasternode").modal("hide");

            fs.appendFile(masternodeFile, dataText, 'utf8',
                function(err) {
                    if (err) throw err;
                });
        });
    }
}

function playNewMasternode(response) {
    var audio = document.getElementById("audioNewAddress");
    audio.play();
}

$(document).on("click", "#openMasternodeConfig", function() {
    fs.readFile(process.resourcesPath + "/apidata/currentAdeDir.json", 'utf8', function(err, data) {
        masternodeFile = (data + "masternode.conf")
        shell.openItem(masternodeFile);
    })
});