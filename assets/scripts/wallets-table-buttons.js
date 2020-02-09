const {clipboard} = require('electron')
const QRCode = require('qrcode')

function walletsFunc(data) {

    var privKey = ''

    adeptiod.command('dumpprivkey', (data)).then(
        (response) => (response != "undefined") ? $("#successWalletPrivKeyExp.alert-success").removeClass("d-none") && $("#successWalletPrivKeyExportToPopUp").html(response + ` - Keep it SAFE!`) &&
        playNewAddress() : console.log("failed to dumpprivkey")
    );

    setTimeout(function() {
        $("#successWalletPrivKeyExp.alert-success").addClass("d-none")
    }, 15000)

    event.preventDefault();
}

function walletsFunc2(data) {
    $("#canvasWalletText").html("<b>" + data + "</b>");
    var canvasWalletAddr = document.getElementById('canvasWalletAddr')
    QRCode.toCanvas(canvasWalletAddr, data, function(error) {
        if (error) console.error(error)
    })
    playNewAddress()
}


function walletsFunc3(data) {
    clipboard.writeText(data)
    $("#successWalletCopy").removeClass("d-none")
    playNewAddress()
    setTimeout(function() {
        $("#successWalletCopy").addClass("d-none")
    }, 15000)
}

function playNewAddress(response) {
    var audio = document.getElementById("audioNewAddress");
    audio.play();
}