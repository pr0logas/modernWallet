setInterval(function() {
    $("#infoBoxStoradeFreeSpace").addClass("d-none");
    $("#infoBoxMoneySupply").addClass("d-none");
    $("#infoBoxStorade").addClass("d-none");
    $("#infoBoxAllMn").addClass("d-none");
    $("#infoBoxMyMn").addClass("d-none");
    $("#infoBoxBlock").addClass("d-none");
    $("#infoBoxDiff").addClass("d-none");
    $("#infoBoxPrice").removeClass("d-none");
    setTimeout(function() {
        $("#infoBoxPrice").addClass("d-none");
        $("#infoBoxBlock").removeClass("d-none");
    }, 5000)
    setTimeout(function() {
        $("#infoBoxBlock").addClass("d-none");
        $("#infoBoxDiff").removeClass("d-none");
    }, 10000)
    setTimeout(function() {
        $("#infoBoxDiff").addClass("d-none");
        $("#infoBoxMyMn").removeClass("d-none");
    }, 15000)
    setTimeout(function() {
        $("#infoBoxMyMn").addClass("d-none");
        $("#infoBoxAllMn").removeClass("d-none");
    }, 20000)
    setTimeout(function() {
        $("#infoBoxAllMn").addClass("d-none");
        $("#infoBoxStorade").removeClass("d-none");
    }, 25000)
    setTimeout(function() {
        $("#infoBoxStorade").addClass("d-none");
        $("#infoBoxMoneySupply").removeClass("d-none");
    }, 30000)
    setTimeout(function() {
        $("#infoBoxMoneySupply").addClass("d-none");
        $("#infoBoxStoradeFreeSpace").removeClass("d-none");
    }, 35000)
}, 40000)