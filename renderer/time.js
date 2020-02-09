function checkTime(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}

function startTime() {
    var today = new Date();
    var h = today.getHours();
    var m = today.getMinutes();
    var s = today.getSeconds();
    var d = today.getDay();

    if (d === 1) {
        d = " Monday";
    } else if (d == 2) {
        d = " Thuesday";
    } else if (d == 3) {
        d = " Wednesday";
    } else if (d == 4) {
        d = " Thursday";
    } else if (d == 5) {
        d = " Friday";
    } else if (d == 6) {
        d = " Saturday";
    } else if (d == 7) {
        d = " Sunday";
    }

    // add a zero in front of numbers<10
    m = checkTime(m);
    s = checkTime(s);
    document.getElementById('time').innerHTML = h + ":" + m + ":" + s + " " + d;
    if (h >= 7 && h < 23) {
        document.getElementById('dayOrNight').innerHTML = " afternoon, "
    } else {
        document.getElementById('dayOrNight').innerHTML = " night, "
    }
    t = setTimeout(function() {
        startTime()
    }, 500);
}
startTime();
playintro();