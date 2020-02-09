// In renderer process (web page).
const {ipcRenderer} = require("electron");
const Client = require('bitcoin-core');
const adeptiod = require("./aderpc.js")
const fs = require('fs');

// Set timeout until loading block index... (20s)
setTimeout(function() {

    // Only once;
    adeptiod.command('help').then((response) => checkIfWalletIsEverLocked(response))

    setInterval(function() {
        adeptiod.getConnectionCount().then((data) => (data >= 1) ? walletOnline() : console.log("No peers, please wait..."));
    }, 5000);
    // Call to adeptiod for Connections
    setInterval(function() {
        adeptiod.getConnectionCount().then((data) => (data != "undefined") ? $("#countConnections").html("<span style='text-weight:bold'>" + data + "</span>") &&
            $("#countConnections2").html("Peers: " + data).fadeIn('slow') : console.log("adeptiod - peers data is empty"));
    }, 5000);
    setInterval(function() {
        adeptiod.getInfo().then((data) => (data != "undefined") ? setMoneyRating(data['moneysupply']) : console.log("moneysupply unknown"));
    }, 15000);
    setInterval(function() {
        adeptiod.getDifficulty().then((data) => (data != "undefined") ? setDifficultyRating(data) : console.log("adeptiod - diff data is empty"));
    }, 15000);
    // Call to adeptiod for Block Count
    setInterval(function() {
        adeptiod.getBlockCount().then((data) => (data != "undefined") ? $("#blockCount").html(data).fadeIn('slow') && $("#blockCount2").html("Block: " + data).fadeIn('slow') :
            console.log("adeptiod - block count data is empty"));
    }, 5000);
    // Get Total Balance
    setInterval(function() {
        adeptiod.getBalance().then((data) => (data != "undefined") ? checkBalance(data) : console.log("balance unknown"));
    }, 5000);
    // Get Total Balance
    setInterval(function() {
        adeptiod.getBalance().then((data) => (data != "undefined") ? calculateAdePrice(data) : console.log("balance unknown"));
    }, 9000);
    // Check for Staking Status (need to grep the 'Staking Active');
    setInterval(function() {
        adeptiod.command('getstakingstatus').then((response) => (response != "undefined") ? writeStakingStatus(response) : console.log("getstakingstatus unknown"));
    }, 60000);

    setInterval(function() {
        adeptiod.getPeerInfo().then((data) => (data != "undefined") ? writePeers(data) : console.log("Peers unknown"));
    }, 20000);
    // This command can be used to check the sync status (verificationprogress: '0.9999952719443589')
    setInterval(function() {
        adeptiod.getBlockchainInfo().then((data) => (data != "undefined") ? blockchainInfo(data) : console.log("getBlockchainInfo unknown"));
    }, 9000);

    setInterval(function() {
        adeptiod.listReceivedByAddress().then((data) => (data != "undefined") ? checkMainWalletAddr(data) : console.log("listReceivedByAddress unknown"));
    }, 5000);

    setInterval(function() {
        adeptiod.command('getaccountaddress', "account").then((response) => (response != "undefined") ? $("#mainWalletAddr").html(response) : console.log("getaccountaddress unknown"));
    }, 5000);

    setInterval(function() {
        adeptiod.command('listreceivedbyaddress', 1, true).then((response) => (response != "undefined") ? writeWallets(response) : console.log("listreceivedbyaddress unknown"));
    }, 6000);

    setInterval(function() {
        adeptiod.command('listtransactions', "*", 3).then((response) => (response != "undefined") ? writeTransactionsForIndex(response) : console.log("listtransactions unknown"));
    }, 3000);

    setInterval(function() {
        adeptiod.command('listtransactions', "*", 100).then((response) => (response != "undefined") ? writeTransactions(response) : console.log("listtransactions unknown"));
    }, 10000);

    setInterval(function() {
        adeptiod.command('listmasternodeconf').then((response) => (response != "undefined") ? writeMyMasternodes(response) : console.log("listtransactions unknown"));
    }, 10000);

    setInterval(function() {
        adeptiod.command('listmasternodes').then((response) => (response != "undefined") ? writeMasternodesList(response) : console.log("listtransactions unknown"));
    }, 10000);

    setInterval(function() {
        adeptiod.command('getunconfirmedbalance').then((response) => (response != "undefined") ? getUnconfirmedBalance(response) : console.log("listtransactions unknown"));
    }, 3000);

    setInterval(function() {
        fs.readFile(process.resourcesPath + "/apidata/walletLockStatus.json", 'utf8', function read(err, data) {
            checkWalletLockStatus(data);
        })
    }, 5000);

}, 40000);

Versions()

function Versions() {
    $(".walletVersion").text("v0.8.0 BETA");
    $(".adeptiodVersion").text("v2.1.8.2");
}

function checkIfWalletIsEverLocked(data) {
    var setDefault = 0;
    fs.writeFile(process.resourcesPath + "/apidata/walletLockStatus.json", setDefault, 'utf8', function(err) {
        if (err) {
            console.log("An error occured while writing JSON Object to File.");
            return console.log(err);
        }
    });

    if (data.match(/walletlock/g).length != null && data.match(/walletlock/g).length == 1) {
        adeptiod.command('walletlock').then((response) => console.log("WalletIsNowLocked"));
        walletLocked = 1
        fs.writeFile(process.resourcesPath + "/apidata/walletLockStatus.json", walletLocked, 'utf8', function(err) {
            if (err) {
                console.log("An error occured while writing JSON Object to File.");
                return console.log(err);
            }
        });
    } else if (data.match(/walletlock/g).length != 1) {
        walletUnLocked = 0
        fs.writeFile(process.resourcesPath + "/apidata/walletLockStatus.json", walletUnLocked, 'utf8', function(err) {
            if (err) {
                console.log("An error occured while writing JSON Object to File.");
                return console.log(err);
            }
        });
    } else {
        walletUnLocked = 0
        fs.writeFile(process.resourcesPath + "/apidata/walletLockStatus.json", walletUnLocked, 'utf8', function(err) {
            if (err) {
                console.log("An error occured while writing JSON Object to File.");
                return console.log(err);
            }
        });
    }
}

function checkWalletLockStatus(data) {
    if (data == 1) {
        $("#walletLockStatus").html(`<img id="" src="assets/images/padlock2.png" alt="OK" width="20" height="" data-toggle="tooltip" title="Wallet Locked">`)
        $(".buttonWalletUnlocked").addClass("d-none")
        $(".buttonWalletLocked").removeClass("d-none")
        $(".sendWalletLockedButton").addClass("d-none")
        $(".buttonWalletUnlockedAfterInitLock").removeClass("d-none")
    } else if (data == 0) {
        $("#walletLockStatus").html(`<img id="" src="assets/images/padlock.png" alt="OK" width="20" height="" data-toggle="tooltip" title="Wallet Unlocked">`)
        $(".buttonWalletUnlocked").removeClass("d-none")
        $(".buttonWalletLocked").addClass("d-none")
        $(".sendWalletLockedButton").removeClass("d-none")
        $(".buttonWalletUnlockedAfterInitLock").addClass("d-none")
    } else if (data === undefined) {
        $("#walletLockStatus").html(`<img id="" src="assets/images/padlock.png" alt="OK" width="20" height="" data-toggle="tooltip" title="Wallet Unlocked">`)
        $(".buttonWalletUnlocked").removeClass("d-none")
        $(".buttonWalletLocked").addClass("d-none")
        $(".sendWalletLockedButton").removeClass("d-none")
        $(".buttonWalletUnlockedAfterInitLock").addClass("d-none")
    } else if (data === null) {
        $("#walletLockStatus").html(`<img id="" src="assets/images/padlock.png" alt="OK" width="20" height="" data-toggle="tooltip" title="Wallet Unlocked">`)
        $(".buttonWalletUnlocked").removeClass("d-none")
        $(".buttonWalletLocked").addClass("d-none")
        $(".sendWalletLockedButton").removeClass("d-none")
        $(".buttonWalletUnlockedAfterInitLock").addClass("d-none")
    }
}

function walletOnline() {
    $("#walletOffline.alert-danger").addClass("d-none");
}

function setDifficultyRating(data) {
    qq = parseFloat(data)
    clearFloat = qq.toFixed(0);
    if (clearFloat < 1000) {
        $("#getDiff").html("Diff: " + (clearFloat.toFixed(0)));
    } else if (clearFloat > 1000) {
        $("#getDiff").html("Diff: " + (clearFloat / 1000).toFixed(0) + " k")
    }
}

function setMoneyRating(data) {
    qq = parseFloat(data)
    clearFloat = qq.toFixed(0);
    if (clearFloat < 1000) {
        $("#GetMoneySupply").html("CoinSupply: " + (clearFloat.toFixed(0)));
    } else if (clearFloat > 1 && clearFloat < 999999) {
        $("#GetMoneySupply").html("Supply: " + (clearFloat / 1000).toFixed(0) + " k")
    } else {
        $("#GetMoneySupply").html("Supply: " + (clearFloat / 1000000).toFixed(0) + " kk")
    }
}

function checkMainWalletAddr(addr) {
    var jsonContent = JSON.stringify(addr);
    fs.writeFile(process.resourcesPath + "/apidata/listReceivedByAddress.json", jsonContent, 'utf8', function(err) {
        if (err) {
            console.log("An error occured while writing JSON Object to File.");
            return console.log(err);
        }
    })
}

function blockchainInfo(content) {
    var jsonContent = JSON.stringify(content);
    fs.writeFile(process.resourcesPath + "/apidata/blockchainInfo.json", jsonContent, 'utf8', function(err) {
        setSyncProgress()
    })
}

// Do nothing
function noop() {};

// SyncBar stuff
function setSyncProgress() {
    fs.readFile(process.resourcesPath + "/apidata/blockchainInfo.json", 'utf8', function(err, data) {
        setProgress = JSON.parse(data);
        var i = setProgress.verificationprogress;
        $("#syncProgressBar").css("width", i * 100 + "%");

        if (i >= 0.999) {

            changeBarToSuccess()

            function changeBarToSuccess() {

                $("#syncProgress").html("Fully synchronized 100%");
                $("#syncProgressBar").addClass("my-primary");
                $("#walletNotSynced.alert-warning").addClass("d-none");
                $("#syncingStatusText").html(`<img src="assets/images/synced.png" alt="OK" width="16" height="" data-toggle="tooltip" title="Synced">`);
                $("#syncingStatusIcon").addClass("d-none");

                setTimeout(function() {
                    $("#footer").addClass("d-none");
                }, 60000);

                changeBarToSuccess = noop
            }

        } else {

            var toFixedNum = parseFloat(i * 100);
            twoNum = toFixedNum.toFixed(2);

            $("#syncProgress").html(twoNum + " %");
            $("#syncProgressBar").removeClass("my-primary");
        }
    })
}

function calculateAdePrice(adecount) {
    fs.readFile(process.resourcesPath + "/apidata/adePriceUsd.json", 'utf8', function read(err, data) {
        result = (adecount * data).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
        $("#setAllAdePriceInUsd").html(result)
        calculatePerAdePrice();
    })
}

function calculatePerAdePrice() {
    fs.readFile(process.resourcesPath + "/apidata/adePriceUsd.json", 'utf8', function read(err, data) {
        result = (1 * data).toFixed(4);
        $("#setAdePriceInUsd").html("$" + result + " ADE").fadeIn('slow');
    })
}

function writeStakingStatus(status) {
    var jsonContent = JSON.stringify(status);
    fs.writeFile(process.resourcesPath + "/apidata/StakingStatus.json", jsonContent, 'utf8', function(err) {
        checkStakingStatus(status);
        if (err) {
            console.log("An error occured while writing JSON Object to File.");
            return console.log(err);
        }
    })
}

function checkStakingStatus() {
    fs.readFile(process.resourcesPath + "/apidata/StakingStatus.json", 'utf8', function read(err, data) {
        setStaking = JSON.parse(data);
        var i = (setStaking['staking status']);
        if (!i) {
            $("#setStaking").removeClass("badge-success");
            $("#setStaking").addClass("badge-warning");
            $("#stakingIconSet").html(`<img id="" src="assets/images/shield.png" alt="OK" width="20" height="" data-toggle="tooltip" title="Staking OFF">`);
        } else {
            $("#setStaking").removeClass("badge-warning").addClass("badge-success");
            $("#stakingIconSet").html(`<img id="" src="assets/images/shield2.png" alt="OK" width="20" height="" data-toggle="tooltip" title="Staking ON">`);
            //playsetstaking() (Play staking sound then enters staking state (only once))
            playStakingInterval();
        }
    })
}

function playStakingInterval() {
    var d = new Date();
    var n = d.getMinutes();
    //Play every hour 59' minute;
    if (n == 59) {
        playstaking();
    }
}

function writeWallets(data) {
    var jsonContent = JSON.stringify(data);
    fs.writeFile(process.resourcesPath + "/apidata/WalletsData.json", jsonContent, 'utf8', function(err) {
        if (err) {
            console.log("An error occured while writing JSON Object to File.");
            return console.log(err);
        }
    })
}

function writeTransactions(data) {
    var jsonContent = JSON.stringify(data);
    fs.writeFile(process.resourcesPath + "/apidata/TransactionsData.json", jsonContent, 'utf8', function(err) {
        if (err) {
            console.log("An error occured while writing JSON Object to File.");
            return console.log(err);
        }
    })
}

function writeTransactionsForIndex(data) {
    var jsonContent = JSON.stringify(data);
    fs.writeFile(process.resourcesPath + "/apidata/TransactionsDataForIndex.json", jsonContent, 'utf8', function(err) {
        if (err) {
            console.log("An error occured while writing JSON Object to File.");
            return console.log(err);
        }
    })
}


function writeMyMasternodes(data) {
    var jsonContent = JSON.stringify(data)
    fs.writeFile(process.resourcesPath + "/apidata/MyMasternodesData.json", jsonContent, 'utf8', function(err) {
        if (err) {
            console.log("An error occured while writing JSON Object to File.");
            return console.log(err);
        }
        checkMyMasternodesEnabledCount()
    })
}

function writeMasternodesList(data) {
    var jsonContent = JSON.stringify(data)
    fs.writeFile(process.resourcesPath + "/apidata/MasternodesListData.json", jsonContent, 'utf8', function(err) {
        if (err) {
            console.log("An error occured while writing JSON Object to File.");
            return console.log(err);
        }
        checkMasternodesEnabledCount()
    })
}

function checkBalance(balance) {
    cardPanel = balance.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
    $("#checkBalance").html(cardPanel)
    if (balance <= 50000) {
        $("#bronze-level").removeClass("d-none");
    } else if (balance > 50000 && balance <= 299999) {
        $("#silver-level").removeClass("d-none");
    } else if (balance > 300000 && balance <= 999999) {
        $("#gold-level").removeClass("d-none");
    } else if (balance >= 1000000) {
        $("#platinum-level").removeClass("d-none");
    }
}

function getUnconfirmedBalance(balance) {
    fs.readFile(process.resourcesPath + "/apidata/getUnconfirmedBalance.json", 'utf8', function read(err, data) {
        if (balance > 0 && balance != data) {
            fs.writeFile(process.resourcesPath + "/apidata/getUnconfirmedBalance.json", balance, 'utf8', function(err) {
                $('#NewCoinsArrived').html(balance.toFixed(4) + " ADE");
                playbalance();
                incomingCoins();
            })
        }
    })
}

function writePeers(data) {
    var jsonContent = JSON.stringify(data);
    fs.writeFile(process.resourcesPath + "/apidata/Peers.json", jsonContent, 'utf8', function(err) {
        if (err) {
            console.log("An error occured while writing JSON Object to File.");
            return console.log(err);
        }
    })
}

function checkMyMasternodesEnabledCount() {
    fs.readFile(process.resourcesPath + "/apidata/MyMasternodesData.json", 'utf8', function read(err, data) {
        var count = (data.match(/ENABLED/g) || []).length;
        $('#MyMasternodesEnabledCount').html(count);
        $('#MyMasternodesEnabledCount2').html("My MN: " + count);
    })
}

function checkMasternodesEnabledCount() {
    fs.readFile(process.resourcesPath + "/apidata/MasternodesListData.json", 'utf8', function read(err, data) {
        var count = (data.match(/ENABLED/g) || []).length;
        $('#MasternodesEnabledCount').html(count);
        $('#MasternodesEnabledCount2').html("Net MN: " + count);
        checkMasternodesAllCount()
    })
}

function checkMasternodesAllCount() {
    fs.readFile(process.resourcesPath + "/apidata/MasternodesListData.json", 'utf8', function read(err, data) {
        jsonResult = JSON.parse(data);
        count(jsonResult)

        function count(jsonResult) {
            var count = 0;
            for (var status in jsonResult) {
                if (jsonResult.hasOwnProperty(status)) {
                    ++count;
                }
            }
            $('#MasternodesAllCount').html(count);
            checkStoradeEnabledCount()
        }
    })
}

function checkStoradeEnabledCount() {
    fs.readFile(process.resourcesPath + "/apidata/StoradeListData.json", 'utf8', function read(err, data) {
        var count = (data.match(/ACTIVE/g) || []).length;
        $('#StoradeEnabledCount').html(count);
        $('#StoradeEnabledCount2').html("storADE: " + count);
        checkStoradeAllCount()
    })
}

function checkStoradeAllCount() {
    fs.readFile(process.resourcesPath + "/apidata/StoradeListData.json", 'utf8', function read(err, data) {
        jsonResult = JSON.parse(data);
        var size = Object.keys(jsonResult['data']).length;
        $('#StoradeAllCount').html(size);
        checkStoradeFreeSpace();
    })
}

function checkStoradeFreeSpace() {
    fs.readFile(process.resourcesPath + "/apidata/StoradeListData.json", 'utf8', function read(err, data) {
        jsonResult = JSON.parse(data);
        var content = jsonResult['data']
        var size = (jsonResult['data']).length;
        var result = 0
        for (i = 0; i < size; i++) {
            result = (+result + +content[i]['free_storage']);
            GBResult = (+result / (1000 * 1000 * 1000))
            if (GBResult < 1000) {
                $('#StoradeFreeSpace').html(parseFloat(GBResult).toFixed(0) + " GB");
                $('#StoradeFreeSpace2').html("sFree " + parseFloat(GBResult).toFixed(0) + " GB");
            } else if (GBResult > 1000) {
                GBResultTB = (GBResult / 1000)
                $('#StoradeFreeSpace').html(parseFloat(GBResultTB).toFixed(1) + " TB");
                $('#StoradeFreeSpace2').html("sFree " + parseFloat(GBResultTB).toFixed(1) + " TB");
            }
        }
    })
}