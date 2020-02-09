const afterLoad = require('after-load');
const request = require("request")
const fs = require('fs');
const fs_extra = require('fs-extra');

var myApiData = {
    latestBlock: "",
    adePriceBtc: "",
    adePriceUsd: "",
    btcPrice: ""
}

// Set Urls
var apiUrls = {
    getBlockCount: "https://explorer.adeptio.cc/api/getblockcount",
    getExplorerInfo: "https://explorer.adeptio.cc/ext/getlasttxs/10/100",
    adePriceBtc: "https://api.adeptio.cc/api/v1/now?key=price",
    btcPrice: "https://api.coingecko.com/api/v3/coins/bitcoin?sparkline=true",
    storadeList: "https://explorer.adeptio.cc/ext/storade_stats"
};

var dir = 'apidata';

if (!fs.existsSync(process.resourcesPath + '/' + dir)) {
    fs.mkdirSync(process.resourcesPath + '/' + dir);
}

var file = (process.resourcesPath + '/' + dir + '/' + 'walletLockStatus.json')
var file2 = (process.resourcesPath + '/' + dir + '/' + 'currentAdeDir.json')

fs_extra.ensureFileSync(file)
fs_extra.ensureFileSync(file2)

// Set Api data to Files
class SetApiDataFromUrl {
    constructor(url) {
        this.setBlockUrl = url.getBlockCount;
        this.setExplorerInfoUrl = url.getExplorerInfo;
        this.setAdePriceBtcUrl = url.adePriceBtc;
        this.setBtcPriceUrl = url.btcPrice;
        this.storadeListUrl = url.storadeList;
    }

    setBlockCount() {
        afterLoad(this.setBlockUrl, function(html) {
            var match = html.match(/[+-]?\d+(?:\.\d+)?/g);
            myApiData['latestBlock'] = match[0];
            fs.writeFile(process.resourcesPath + "/apidata/latestBlockfromExplorer.json", match[0], 'utf8', function(err) {
                if (err) {
                    console.log("An error occured while writing JSON Object to File.");
                    return console.log(err);
                }
            });
        })
    }

    setBtcPrice() {
        var btcPrice = request({
            url: this.setBtcPriceUrl,
            json: true
        }, function(error, response, body) {

            if (!error && response.statusCode === 200) {
                fs.writeFile(process.resourcesPath + "/apidata/btcPriceUsd.json", body.market_data.current_price.usd, 'utf8', function(err) {
                    if (err) {
                        console.log("An error occured while writing JSON Object to File.");
                        return console.log(err);
                    }
                });
            }
        })
    }

    setExplorerInfo() {
        var btcPrice = request({
            url: this.setExplorerInfoUrl,
            json: true
        }, function(error, response, body) {

            if (!error && response.statusCode === 200) {
                var jsonContent = JSON.stringify(body)
                fs.writeFile(process.resourcesPath + "/apidata/getExplorerInfo.json", jsonContent, 'utf8', function(err) {
                    if (err) {
                        console.log("An error occured while writing JSON Object to File.");
                        return console.log(err);
                    }
                });
            }
        })
    }

    setStoradeList() {
        var btcPrice = request({
            url: this.storadeListUrl,
            json: true
        }, function(error, response, body) {
            ;
            if (!error && response.statusCode === 200) {
                var jsonContent = JSON.stringify(body)
                fs.writeFile(process.resourcesPath + "/apidata/StoradeListData.json", jsonContent, 'utf8', function(err) {
                    if (err) {
                        console.log("An error occured while writing JSON Object to File.");
                        return console.log(err);
                    }
                });
            }
        })
    }

    // 

    setAdePriceBtc() {
        request({
            url: this.setAdePriceBtcUrl,
            json: true
        }, function(error, response, body) {

            if (!error && response.statusCode === 200) {
                fs.writeFile(process.resourcesPath + "/apidata/adePriceBtc.json", body.data, 'utf8', function(err) {
                    if (err) {
                        console.log("An error occured while writing JSON Object to File.");
                        return console.log(err);
                    }
                })
            }
        })
    }

    setAdePriceUsd() {
        var adePriceBtc;
        var btcPriceUsd;
        var result;
        fs.readFile(process.resourcesPath + "/apidata/adePriceBtc.json", 'utf8', function read(err, data) {
            adePriceBtc = data
            var btcPriceUsd = fs.readFile(process.resourcesPath + "/apidata/btcPriceUsd.json", function read(err, data) {
                btcPriceUsd = data
                result = (btcPriceUsd * adePriceBtc);
                fs.writeFile(process.resourcesPath + "/apidata/adePriceUsd.json", result, 'utf8', function(err) {
                    if (err) {
                        console.log("An error occured while writing JSON Object to File.");
                        return console.log(err);
                    }
                })
            })
        })
    }
}

// Create new SetApiDataFromUrl variable
apiDataSet = new SetApiDataFromUrl(apiUrls);

// First init
//apiDataSet.setBlockCount()
apiDataSet.setBtcPrice()
apiDataSet.setAdePriceBtc()
apiDataSet.setStoradeList()
apiDataSet.setAdePriceUsd()
apiDataSet.setExplorerInfo()
setTimeout(function() {
    apiDataSet.setAdePriceUsd()
}, 4000);

setTimeout(function() {
    apiDataSet.setExplorerInfo()
}, 300000);

// Later do in interval
setInterval(function() {
    apiDataSet.setBtcPrice()
}, 3600000)

setInterval(function() {
    apiDataSet.setAdePriceBtc()
}, 3600000)

setInterval(function() {
    apiDataSet.setStoradeList()
}, 3600000)

setInterval(function() {
    apiDataSet.setAdePriceUsd()
}, 3600000)