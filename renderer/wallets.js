const adeptiod = require('./aderpc.js');

$(document).on('submit', "#getAdeptioWallet", function() {
    var data = [];
    $.each($(this).serializeArray(), function(key, value) {
        data[value['name']] = value['value'];
    });
    event.preventDefault();

    $("#successAddrName").html(data['walletlabel'])

    adeptiod.command('getnewaddress', data['walletlabel']).then(
        (response) => (response != "undefined") ? $("#successWalletCreation.alert-success").removeClass("d-none") && playNewAddress() : $("#failedWalletCreation.alert-danger").removeClass("d-none")
    );
    event.preventDefault();
    $('#createAdeptioWallet').modal('toggle'); //or  $('#IDModal').modal('hide');
    return false;
});

$(document).on('submit', "#formImportWalletPrivKey", function() {
    var data = [];
    $.each($(this).serializeArray(), function(key, value) {
        data[value['name']] = value['value'];
    });
    event.preventDefault();

    $("#successPrivKeyImportAddr").html(data['privkey-name'])

    var privKey = data['privkey-hash']
    var privKeyName = data['privkey-name']

    adeptiod.command('importprivkey', privKey, privKeyName).then(
        (response) => (response != "undefined") ? $("#successPrivKeyImport.alert-success").removeClass("d-none") && playImportPrivKey() : console.log("failed to import privkey")
    );
    event.preventDefault();
    $('#importWalletPrivKey').modal('toggle'); //or  $('#IDModal').modal('hide');
    return false;
});

function playImportPrivKey() {
    var audio = document.getElementById("audioNewAddress");
    audio.play();
    setTimeout(function() {
        $("#successPrivKeyImport.alert-success").addClass("d-none")
    }, 60000)
}

function playNewAddress() {
    var audio = document.getElementById("audioNewAddress");
    audio.play();
    setTimeout(function() {
        $("#successWalletCreation.alert-success").addClass("d-none")
    }, 60000)
}