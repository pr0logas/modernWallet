const adeptiod = require('./aderpc.js');

$(document).on('submit', "#sendAdeptioTo", function() {
    event.preventDefault();
    var data = [];
    $.each($(this).serializeArray(), function(key, value) {
        data[value['name']] = value['value'];
    });

    if (!validAddress(data['address'])) {

        $('#validationServer03').addClass('is-invalid');
        $('.invalid-address').removeClass('d-none');

        return;
    } else {
        $('#validationServer03').removeClass('is-invalid');
        $('#validationServer03').addClass('is-valid');
        $('.invalid-address').addClass('d-none');
    }

    if (!validAmount(data['amount'])) {

        $('#validationServer05').addClass('is-invalid');
        $('.invalid-amount').removeClass('d-none');

        return;
    } else {
        $('#validationServer05').removeClass('is-invalid');
        $('#validationServer05').addClass('is-valid');
        $('.invalid-amount').addClass('d-none');
    }

    adeptiod.command('sendtoaddress', data['address'], parseFloat(data['amount'])).then(
        (response) => (response != "undefined") ? $("#successSendAddr").html(data['address']) && $("#successSend.alert-success").removeClass("d-none") && playSend() : $("failedSend.alert-danger").removeClass("d-none")
    );
});

function playSend() {
    var audio = document.getElementById("audioSend");
    audio.play();
    setTimeout(function() {
        $("#successSend.alert-success").addClass("d-none")
    }, 60000)
}

function validAddress(address) {
    if (!address.match("^[A][a-km-zA-HJ-NP-Z1-9]{24,33}$")) {
        return false;
    }
    return true;
}

function validAmount(amount) {
    if (!amount.match("[0-9]{1,9}$")) {
        return false;
    }
    return true;
}