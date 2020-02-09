// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const {app, ipcMain, BrowserWindow, ipcRenderer} = require('electron')
const QRCode = require('qrcode')
const Client = require('bitcoin-core');
const adeptiod = require("./aderpc.js")
const shell = require('electron').shell;

function renderTemplate(template, data, container, force_reload = true) {
    if (!force_reload && $("#" + container).length != 0) {
        $("#mainContent").children().addClass('d-none');
        $("#" + container).removeClass('d-none');
        return
    }

    var template = Handlebars.compile(ipcRenderer.sendSync("getTemplateContent", template));

    if ($("#" + container).length == 0) {
        $("#mainContent").append("<div id='" + container + "'></div>");
    }

    /*if (!container) {
      container = $("#mainContent");
    }*/

    $("#mainContent").children().addClass('d-none');

    container = $("#" + container);
    container.removeClass('d-none');
    container.empty();
    container.html(template(data));
}

//open links externally by default
$(document).on('click', 'a[href^="http"]', function(event) {
    event.preventDefault();
    shell.openExternal(this.href);

});

function renderOverview(force_reload = false) {
    var renderData = {
        addressData: [],
    };

    renderTemplate("index.html", renderData, "main-overview", force_reload);
    $(document).trigger("render_overview");

    var canvas = document.getElementById('canvas')

    setTimeout(function() {
        setInterval(function() {
            adeptiod.command('getaccountaddress', "account").then((response) => (response != "undefined") ? qrcodeAddress(response) : console.log("getaccountaddress unknown"));
        }, 5000);
    }, 40000);


    function qrcodeAddress(addr) {
        QRCode.toCanvas(canvas, addr, function(error) {
            if (error) console.error(error)
        })
    }
}

function renderAbout(force_reload = false) {
    var renderData = {
        addressData: [],
    };

    renderTemplate("about.html", renderData, "main-about", force_reload);
    $(document).trigger("render_about");
}

function renderWallets(force_reload = false) {
    var renderData = {
        addressData: [],
    };

    renderTemplate("wallets.html", renderData, "main-wallets", force_reload);
    $(document).trigger("render_wallets");
}

function renderWallets2(force_reload = false) {
    var renderData = {
        addressData: [],
    };

    renderTemplate("wallets.html", renderData, "main-wallets", force_reload);
    $(document).trigger("render_wallets");
}

function renderSend(force_reload = false) {
    var renderData = {
        addressData: [],
    };

    renderTemplate("send.html", renderData, "main-send", force_reload);
    $(document).trigger("render_send");
}

function renderSend2(force_reload = false) {
    var renderData = {
        addressData: [],
    };

    renderTemplate("send.html", renderData, "main-send", force_reload);
    $(document).trigger("render_send");
}


function renderTransactions(force_reload = false) {
    var renderData = {
        addressData: [],
    };

    renderTemplate("transactions.html", renderData, "main-transactions", force_reload);
    $(document).trigger("render_transactions");
}

function renderPeers(force_reload = false) {
    var renderData = {
        addressData: [],
    };

    renderTemplate("peers.html", renderData, "main-peers", force_reload);
    $(document).trigger("render_peers");
}

function renderMasternodes(force_reload = false) {
    var renderData = {
        addressData: [],
    };

    renderTemplate("masternodes.html", renderData, "main-masternodes", force_reload);
    $(document).trigger("render_masternodes");
}

function renderStorade(force_reload = false) {
    var renderData = {
        addressData: [],
    };

    renderTemplate("storade.html", renderData, "main-storade", force_reload);
    $(document).trigger("render_storade");
}

function renderMasternodesList(force_reload = false) {
    var renderData = {
        addressData: [],
    };

    renderTemplate("masternodes_list.html", renderData, "main-masternodes_list", force_reload);
    $(document).trigger("render_masternodes_list");
}

function renderSendAdvanced(force_reload = false) {
    var renderData = {
        addressData: [],
    };

    renderTemplate("send_advanced.html", renderData, "main-send_advanced", force_reload);
    $(document).trigger("render_send_advanced");
}

function renderExchanges(force_reload = false) {
    var renderData = {
        addressData: [],
    };

    renderTemplate("exchanges.html", renderData, "main-exchanges", force_reload);
    $(document).trigger("render_exchanges");
}

function renderSettings(force_reload = false) {
    var renderData = {
        addressData: [],
    };

    renderTemplate("settings.html", renderData, "main-settings", force_reload);
    $(document).trigger("render_settings");
}

$("#mainNavBtnOverview").click(function() {
    renderOverview();
});

$("#mainNavBtnSend").click(function() {
    renderSend();
});

$("#mainNavBtnWallets").click(function() {
    renderWallets();
});

$("#mainNavBtnTransactions").click(function() {
    renderTransactions();
});

$("#mainNavBtnPeers").click(function() {
    renderPeers();
});

$(document).on('click', "#mainNavBtnMasternodes", function() {
    renderMasternodes();
});

$("#mainNavBtnStorade").click(function() {
    renderStorade();
});

$(document).on('click', "#mainNavBtnMasternodes_list", function() {
    renderMasternodesList();
});

$(document).on('click', "#mainNavBtnSend_advanced", function() {
    renderSendAdvanced();
});

$(document).on('click', "#mainNavBtnExchanges", function() {
    renderExchanges();
});

$(document).on('click', "#mainNavBtnSettings", function() {
    renderSettings();
});

$(document).on('click', "#mainNavBtnSend2", function() {
    renderSend2();
});

$(document).on('click', "#mainNavBtnWallets2", function() {
    renderWallets2();
});

$(document).on('click', "#mainNavBtnAbout", function() {
    renderAbout();
    $('#showAbout').modal('toggle');
});

renderAbout();
renderSend();
renderSend2();
renderWallets();
renderWallets2();
renderTransactions();
renderPeers();
renderMasternodes();
renderStorade();
renderMasternodesList();
renderExchanges();
renderSettings();
renderOverview();