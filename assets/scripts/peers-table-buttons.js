const adeptiod = require('./renderer/aderpc.js');

function peersFunc(data) {
    var setPeer = data.replace(/:9075/g, '/32');

    adeptiod.command('setban', (setPeer), "add", 0).then(
        (response) => (response != "undefined") ? $("#bannedPeer.alert-success").removeClass("d-none") && playNewAddress() : console.log("ban peer failed")
    );
    event.preventDefault();

    $("#bannedPeerAddr").html(setPeer + ` - It will take some time to reflect the new data.`)
}

function playNewAddress() {
    var audio = document.getElementById("audioNewAddress");
    audio.play();
    setTimeout(function() {
        $("#bannedPeer.alert-success").addClass("d-none")
    }, 60000)
}