const adeptiod = require('./aderpc.js');

$(document).on('submit', "#getAdeptioNewPeerFromUser", function() {
    event.preventDefault();
    var data = [];
    $.each($(this).serializeArray(), function(key, value) {
        data[value['name']] = value['value'];
    });


    adeptiod.command('addnode', data['peerIP'], 'add').then(
        (response) => (response != "undefined") ? $("#successPeer.alert-success").removeClass("d-none") && playNewAddress() : console.log("perr add failed")
    );
    $("#successPeerAddr").html(data['peerIP'] + ` // It will take some time to make a connection.`)
    event.preventDefault();
    $('#addNewNetworkPeers').modal('toggle'); //or  $('#IDModal').modal('hide');
    return false;
});

$(document).on('click', "#clearBannedPeers", function() {
    adeptiod.command('clearbanned').then(
        (response) => (response != "undefined") ? $("#clearBannedPeer.alert-success").removeClass("d-none") && playClearBanned() : console.log("clearbanned failed")
    );
});

function playNewAddress() {
    var audio = document.getElementById("audioNewAddress");
    audio.play();
    setTimeout(function() {
        $("#successPeer.alert-success").addClass("d-none")
    }, 60000)
}

function playClearBanned() {
    var audio = document.getElementById("audioNewAddress");
    audio.play();
    setTimeout(function() {
        $("#clearBannedPeer.alert-success").addClass("d-none")
    }, 60000)
}