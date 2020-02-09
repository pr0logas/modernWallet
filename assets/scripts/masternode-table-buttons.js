function masternodeFunc(name) {
    adeptiod.command('masternode', 'start-alias', 'alias', name).then(
        (response) => (response != "undefined") ? checkStartStatus(response) : console.log("masternode start failed"));
}

function checkStartStatus(response) {
    status = response.overall;
    $("#masternodeStartStatus").html(" " + status + " Please take a note, that masternode status change every 6h!");
    $("#masternodeStart").removeClass("d-none");
    playNewMasternodeStart()
}

function playNewMasternodeStart() {
    var audio = document.getElementById("audioNewAddress");
    audio.play();
    setTimeout(function() {
        $("#masternodeStart").addClass("d-none");
    }, 15000)
}