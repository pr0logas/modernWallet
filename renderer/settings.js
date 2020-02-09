const fs = require('fs');
const adeptiod = require('./aderpc.js');
const {app} = require('electron');
const os = require('os');
const {ipcRenderer} = require('electron')
const jetpack = require('fs-jetpack');

// Adeptio dir
setHomeDirByUser()

function setHomeDirByUser() {
    fs.readFile(process.resourcesPath + "/apidata/userSpecifiedDataDir.json", 'utf8', function(err, data) {
        if (typeof(data) !== 'undefined') {
            if (os.type() == "Windows_NT") {
                var userHome = (data + "\\adeptio\\");
                document.getElementById("setUserHome").innerHTML = (userHome)
                writeCurrentAdeAdir(userHome);
            } else {
                var userHome = (data + "/adeptio/");
                document.getElementById("setUserHome").innerHTML = (userHome)
                writeCurrentAdeAdir(userHome);
            }
        } else {

            if (os.type() == "Windows_NT") {
                var userHome = (`C:\\Users\\` + (os.userInfo().username) + `\\Appdata\\Roaming` + `\\ADE\\`);
                document.getElementById("setUserHome").innerHTML = (userHome)
                writeCurrentAdeAdir(userHome);

            } else if (os.type() == "Darwin") {
                var userHome = (`/` + (os.userInfo().username) + `/Library/Application Support/ADE/`);
                document.getElementById("setUserHome").innerHTML = (userHome)
                writeCurrentAdeAdir(userHome);

            } else if (os.type() == "Linux") {
                var userHome = (os.homedir() + `/.adeptio/`)
                document.getElementById("setUserHome").innerHTML = (userHome)
                writeCurrentAdeAdir(userHome);

            } else {
                var userHome = "Unknown";
            }

        }
    })
}

function writeCurrentAdeAdir(userHome) {
    fs.writeFile(process.resourcesPath + "/apidata/currentAdeDir.json", userHome, 'utf8', function(err) {
        if (err) {
            console.log("An error occured while writing JSON Object to File.");
            return console.log(err);
        }
    });
}


// User Selects Path
let selectDirBtn = document.getElementById('select-directory')

selectDirBtn.addEventListener('click', (event) => {
    ipcRenderer.send('open-file-dialog')
})

ipcRenderer.on('selected-directory', (event, path) => {
    //document.getElementById('selected-file').innerHTML = `${path}`
    fs.writeFile(process.resourcesPath + "/apidata/userSpecifiedDataDir.json", `${path}`, 'utf8', function(err) {
        if (err) {
            console.log("An error occured while writing JSON Object to File.");
            return console.log(err);
        }
        setHomeDirByUser()
        alert("You need to restart the wallet in order to apply new settings.")
    });
})

// Set User ADE path;
var adeptioPath = "";
fs.readFile(process.resourcesPath + "/apidata/currentAdeDir.json", 'utf8', function read(err, data) {
    adeptioPath = data;
})

// User Exports wallet.dat
let selectWalletDatBtn = document.getElementById('select-wallet-dat')

selectWalletDatBtn.addEventListener('click', (event) => {
    ipcRenderer.send('open-file-dialog-wallet-dat')
})
    if (os.type() == "Windows_NT") {

        ipcRenderer.on('selected-directory-wallet-dat', (event, path) => {
            var path = (`${path}` + "\\wallet.dat");
            jetpack.copy(adeptioPath + "wallet.dat", path, { overwrite: true });
            alert("File successfully copied to: " + path);
        })
    } else if (os.type() == "Darwin") {
        ipcRenderer.on('selected-directory-wallet-dat', (event, path) => {
            var path = (`${path}` + "/wallet.dat");
            jetpack.copy(adeptioPath + "wallet.dat", path, { overwrite: true });
            alert("File successfully copied to: " + path);
        })
    } else if (os.type() == "Linux") {
        ipcRenderer.on('selected-directory-wallet-dat', (event, path) => {
            var path = (`${path}` + "/wallet.dat");
            jetpack.copy(adeptioPath + "wallet.dat", path, { overwrite: true });
            alert("File successfully copied to: " + path);
        })
}


// Sounds
$('#mute-button').on('click', function() {

    var audioElements = document.getElementsByTagName('audio');
    for (var i = 0; i < audioElements.length; ++i) {
        audioElements[i].volume = 0.0;
        $(".unmute-button-color").removeClass("d-none")
        $(".mute-button-color").addClass("d-none")
    }
});

$('#unmute-button').on('click', function() {

    var audioElements = document.getElementsByTagName('audio');
    for (var i = 0; i < audioElements.length; ++i) {
        audioElements[i].volume = 1.0;
        $(".unmute-button-color").addClass("d-none")
        $(".mute-button-color").removeClass("d-none")
    }
});

// Wallet Lock
$(document).on('submit', "#lockAdeptioWallet", function() {
    var data = [];
    $.each($(this).serializeArray(), function(key, value) {
        data[value['name']] = value['value'];
    });
    event.preventDefault();

    adeptiod.command('encryptwallet', data['lockPassword']).then(
        (response) => (response != "undefined") ? walletIsNowLocked() : console.log("failed to createLock")
    );
    event.preventDefault();
    $('#doLockAdeptioWallet').modal('toggle'); //or  $('#IDModal').modal('hide');
    return false;
});


function walletIsNowLocked() {
    walletLocked = 1
    $("#wallet-unlock-button.btn-success").removeClass("d-none")
    $("#wallet-lock-button.btn-warning").addClass("d-none")
    fs.writeFile(process.resourcesPath + "/apidata/walletLockStatus.json", walletLocked, 'utf8', function(err) {
        if (err) {
            console.log("An error occured while writing JSON Object to File.");
            return console.log(err);
        }
    });
    alert("Please restart Adeptio Modern Wallet")
}

// Wallet unlock 
$(document).on('submit', "#unlockAdeptioWallet", function() {
    var data = [];
    $.each($(this).serializeArray(), function(key, value) {
        data[value['name']] = value['value'];
    });
    event.preventDefault();

    adeptiod.command('walletpassphrase', data['unlockPassword'], 0).then(
        (response) => (response != "undefined") ? walletIsNowUnLocked() : console.log("failed to UnLock")
    );
    event.preventDefault();
    $('#doUnLockAdeptioWallet').modal('toggle'); //or  $('#IDModal').modal('hide');
    return false;
});

// Wallet unlock 
$(document).on('submit', "#unlockAdeptioWalletFromSend", function() {
    var data = [];
    $.each($(this).serializeArray(), function(key, value) {
        data[value['name']] = value['value'];
    });
    event.preventDefault();

    adeptiod.command('walletpassphrase', data['unlockPassword'], 0).then(
        (response) => (response != "undefined") ? walletIsNowUnLocked() : console.log("failed to UnLock")
    );
    event.preventDefault();
    $('#WalletFromSendUnlockAdeptio').modal('toggle'); //or  $('#IDModal').modal('hide');
    return false;
});

function walletIsNowUnLocked() {
    walletUnLocked = 0
    fs.writeFile(process.resourcesPath + "/apidata/walletLockStatus.json", walletUnLocked, 'utf8', function(err) {
        if (err) {
            console.log("An error occured while writing JSON Object to File.");
            return console.log(err);
        }
    });
}