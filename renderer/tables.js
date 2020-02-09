const {ipcRenderer} = require("electron");

// index.html
var ctableIndex = $('#tx-tableIndex').DataTable({
    bInfo: false,
    autoWidth: false,
    searching: false,
    ordering: true,
    responsive: true,
    lengthChange: true,
    processing: false,
    bPaginate: true,
    bLengthChange: false,
    pageLength: 5,
    order: [
        [1, "desc"]
    ],
    ajax: {
        url: process.resourcesPath + '/apidata/getExplorerInfo.json',
        dataSrc: function(json) {

            var r = [];

            $.each(json.data.slice(0, 999), function(key, value) {
                var styleCategory = ''
                if (value['category'] == 'receive')
                    styleCategory = 'badge badge-success';

                if (value['category'] == 'send')
                    styleCategory = 'badge badge-warning';

                var styleAmount = ''
                if (value['amount'] < 0)
                    styleAmount = 'badge badge-danger';
                else
                    styleAmount = 'badge badge-success';

                var styleConf = ''
                if (value['confirmations'] < 3)
                    styleConf = 'badge badge-warning';
                else
                    styleConf = 'badge badge-success';

                var styleBlock = 'badge badge-light'
                var styleTime = 'badge badge-light'
                var styleTxid = 'badge badge-light'
                var styleTotal = 'badge badge-light'
                var styleQq = 'badge badge-light'
                json.data[key]['blockindex'] = '<span class="' + styleBlock + '">' + value['blockindex'] + '</span>';
                json.data[key]['timestamp'] = '<span class="' + styleTime + '">' + new Date((value['timestamp']) * 1000).toLocaleString('lt-LT', {
                    hour12: false
                }) + '</span>';
                json.data[key]['blockhash'] = '<span class="' + styleTxid + '">' + value['blockhash'] + '</span>';
                json.data[key]['.vout.length'] = '<span class="' + styleQq + '">' + value['.vout.length'] + '</span>';
                json.data[key]['total'] = '<span class="' + styleTotal + '">' + (+value['total'] / 100000000) + '</span>';

                r.push(value)
            });

            return r;

        },
        error: function(xhr, error, thrown) {
            console.log("index table err");
        }

    },
    columns: [{
            data: 'blockindex',
            width: '12%'
        },
        {
            data: 'timestamp',
            width: '12%'
        },
        {
            data: 'blockhash',
            width: '20%'
        },
        {
            data: '.vout.length',
            width: '20%'
        },
        {
            data: 'total',
            width: '12%'
        },
    ]
});

// masternode.html
var ctableMasternode = $('#tx-tableMasternode').DataTable({
    bInfo: false,
    autoWidth: false,
    searching: false,
    ordering: true,
    responsive: true,
    lengthChange: true,
    processing: false,
    bPaginate: true,
    bLengthChange: false,
    pageLength: 10,
    order: [
        [0, "desc"]
    ],
    ajax: {
        url: process.resourcesPath + '/apidata/MyMasternodesData.json',
        dataSrc: function(json) {
            $.each(json, function(key, value) {


                var styleOutputIndex = 'badge badge-light'
                var styleAlias = 'badge badge-light'
                var styleAdress = 'badge badge-light'
                var style = '';
                if (value['status'] == 'ENABLED')
                    style = 'badge badge-success';
                if (value['status'] == 'PRE_ENABLED')
                    style = 'badge badge-warning';
                if (value['status'] == 'MISSING')
                    style = 'badge badge-danger';
                if (value['status'] == 'EXPIRED')
                    style = 'badge badge-warning';
                if (value['status'] == 'REMOVE')
                    style = 'badge badge-danger';

                json[key]['status'] = '<span class="' + style + '">' + value['status'] + '</span>';
                json[key]['alias'] = '<span class="' + styleAlias + '">' + value['alias'] + '</span>';
                json[key]['outputIndex'] = '<span class="' + styleOutputIndex + '">' + value['outputIndex'] + '</span>';
                json[key]['action'] = '<div onclick="masternodeFunc(\'' + value['address'] + '\')"> \
          <img src="assets/images/green-energy.png" class="pointer masternodeTurnOn" alt="key" width="20" height="">\
          </div>';
                json[key]['address'] = '<span class="' + styleAdress + '">' + value['address'] + '</span>';

                if (value['status'] == 'MISSING')
                    json[key]['action'] = '';

            });
            return json;
        },
        error: function(xhr, error, thrown) {
            console.log("masternode table err");
        }
    },
    columns: [{
            data: 'alias',
            width: '12%'
        },
        {
            data: 'status',
            width: '12%'
        },
        {
            data: 'address',
            width: '20%'
        },
        {
            data: 'outputIndex',
            width: '12%'
        },
        {
            data: 'action',
            width: '12%'
        },
    ]
});

// masternode_list.html
var ctableMasternodeList = $('#tx-tabletableMasternodeList').DataTable({
    bInfo: false,
    autoWidth: false,
    searching: true,
    ordering: true,
    responsive: true,
    lengthChange: true,
    processing: false,
    bPaginate: true,
    bLengthChange: false,
    pageLength: 10,
    order: [
        [3, "desc"]
    ],
    ajax: {
        url: process.resourcesPath + '/apidata/MasternodesListData.json',
        dataSrc: function(json) {
            $.each(json, function(key, value) {
                var styleIP = 'badge badge-light'
                var styleAdress = 'badge badge-light'
                var styleVersion = 'badge badge-light'
                var styleLastPaid = 'badge badge-light'

                var style = '';
                if (value['status'] == 'ENABLED')
                    style = 'badge badge-success';
                if (value['status'] == 'PRE_ENABLED')
                    style = 'badge badge-warning';
                if (value['status'] == 'MISSING')
                    style = 'badge badge-danger';
                if (value['status'] == 'EXPIRED')
                    style = 'badge badge-danger';

                json[key]['ip'] = '<span class="' + styleIP + '">' + value['ip'] + '</span>';
                json[key]['status'] = '<span class="' + style + '">' + value['status'] + '</span>';
                json[key]['lastpaid'] = '<span class="' + styleLastPaid + '">' + new Date((value['lastseen']) * 1000).toLocaleString('lt-LT', {
                    hour12: false
                }) + '</span>';
                json[key]['addr'] = '<span class="' + styleAdress + '">' + value['addr'] + '</span>';
                json[key]['version'] = '<span class="' + styleVersion + '">' + value['version'] + '</span>';
            });
            return json;
        },
        error: function(xhr, error, thrown) {
            console.log("masternode_list table err");
        }
    },
    columns: [{
            data: 'ip',
            width: '12%'
        },
        {
            data: 'status',
            width: '12%'
        },
        {
            data: 'lastpaid',
            width: '12%'
        },
        {
            data: 'addr',
            width: '20%'
        },
        {
            data: 'version',
            width: '12%'
        },
    ]
});




// peers.html
var ctablePeers = $('#tx-tablePeers').DataTable({
    bInfo: false,
    autoWidth: false,
    searching: false,
    ordering: true,
    responsive: true,
    lengthChange: true,
    processing: false,
    bPaginate: true,
    bLengthChange: false,
    pageLength: 10,
    order: [
        [1, "desc"]
    ],
    ajax: {
        url: process.resourcesPath + '/apidata/Peers.json',
        dataSrc: function(json) {

            $.each(json, function(key, value) {
                var styleSubver = 'badge badge-light';
                var styleVersion = 'badge badge-light';
                var styleBytessent = 'badge badge-warning';
                var styleBytesrecv = 'badge badge-success';
                var styleAddr = 'badge badge-light';

                value['bytessent'] = (((value['bytessent']) / (1000 * 1000)).toFixed(2) + " MB");
                value['bytesrecv'] = (((value['bytesrecv']) / (1000 * 1000)).toFixed(2) + " MB");
                json[key]['subver'] = '<span class="' + styleSubver + '">' + value['subver'] + '</span>';
                json[key]['version'] = '<span class="' + styleVersion + '">' + value['version'] + '</span>';
                json[key]['bytessent'] = '<span class="' + styleBytessent + '">' + value['bytessent'] + '</span>';
                json[key]['bytesrecv'] = '<span class="' + styleBytesrecv + '">' + value['bytesrecv'] + '</span>';
                json[key]['action'] = '<div onclick="peersFunc(\'' + value['addr'] + '\')"> \
          <img src="assets/images/wrong.png" class="pointer data-toggle="tooltip" title="Ban Peer"" alt="key" width="20" height="">\
          </div>';
                json[key]['addr'] = '<span class="' + styleAddr + '">' + value['addr'] + '</span>';

            });
            return json;
        },
        error: function(xhr, error, thrown) {
            console.log("peers table err");
        }
    },
    columns: [{
            data: 'subver',
            width: '12%'
        },
        {
            data: 'addr',
            width: '20%'
        },
        {
            data: 'version',
            width: '12%'
        },
        {
            data: 'bytessent',
            width: '12%'
        },
        {
            data: 'bytesrecv',
            width: '12%'
        },
        {
            data: 'action',
            width: '12%'
        },
    ]
});

// storade.html
var ctableStorade = $('#tx-tableStorade').DataTable({
    bInfo: false,
    autoWidth: false,
    searching: true,
    ordering: true,
    responsive: true,
    lengthChange: true,
    processing: false,
    bPaginate: true,
    bLengthChange: false,
    pageLength: 10,
    order: [
        [3, "desc"]
    ],
    ajax: {
        url: process.resourcesPath + '/apidata/StoradeListData.json',
        dataSrc: function(json) {

            var r = [];

            $.each(json.data, function(key, value) {

                value['ip'] = 'ip' in value ? value['ip'] : '';
                value['status'] = 'status' in value ? value['status'] : '';
                value['lastseen'] = 'status' in value ? value['lastseen'] : '';
                value['python'] = 'status' in value ? value['python'] : '';
                value['os'] = 'os' in value ? value['os'] : '';
                value['free_storage'] = (((value['free_storage']) / (1000 * 1000 * 1000)).toFixed(2) + " GB");
                value['free_storage'] = 'free_storage' in value ? value['free_storage'] : '';

                var styleIP = 'badge badge-light'
                var styleAdress = 'badge badge-light'
                var styleVersion = 'badge badge-light'
                var styleTime = 'badge badge-light'
                var styleOS = 'badge badge-light'

                var style = '';
                if (value['status'] == 'ACTIVE')
                    style = 'badge badge-success';
                if (value['status'] == 'INACTIVE')
                    style = 'badge badge-warning';
                if (value['status'] == `Can't get masternode ip`)
                    style = 'badge badge-danger';

                var osSystem = '';
                if (value['os'] == `'Ubuntu', '18.04', 'bionic'`)
                    osSystem = '<img src="assets/images/os/ubuntu.png" alt="Ubuntu" width="24" height="24">'
                if (value['os'] == `'Ubuntu', '16.04', 'xenial'`)
                    osSystem = '<img src="assets/images/os/ubuntu.png" alt="Ubuntu" width="24" height="24">'


                json.data[key]['lastseen'] = '<span class="' + styleTime + '">' + new Date((value['lastseen']) * 1000).toLocaleString('lt-LT', {
                    hour12: false
                }) + '</span>';
                json.data[key]['ip'] = '<span class="' + styleIP + '">' + value['ip'] + '</span>';
                json.data[key]['os'] = osSystem + '<span class="' + styleOS + '">' + value['os'] + '</span>';
                json.data[key]['status'] = '<span class="' + style + '">' + value['status'] + '</span>';
                json.data[key]['free_storage'] = '<span class="' + styleAdress + '">' + value['free_storage'] + '</span>';
                json.data[key]['python'] = '<span class="' + styleVersion + '">' + value['python'] + '</span>';

                r.push(value);
            });
            return r;
        },
        error: function(xhr, error, thrown) {
            console.log("storade table err");
        }
    },
    columns: [{
            data: 'ip',
            width: '12%'
        },
        {
            data: 'status',
            width: '12%'
        },
        {
            data: 'lastseen',
            width: '12%'
        },
        {
            data: 'python',
            width: '12%'
        },
        {
            data: 'os',
            width: '20%'
        },
        {
            data: 'free_storage',
            width: '12%'
        },
    ]
});


// transactions.html
var ctableTransactions = $('#tx-tableTransactions').DataTable({
    bInfo: false,
    autoWidth: false,
    searching: true,
    ordering: true,
    responsive: true,
    lengthChange: true,
    processing: false,
    bLengthChange: false,
    pageLength: 10,
    bPaginate: true,
    order: [
        [1, "desc"]
    ],
    ajax: {
        url: process.resourcesPath + '/apidata/TransactionsData.json',
        dataSrc: function(json) {
            $.each(json, function(key, value) {
                var styleCategory = ''
                if (value['category'] == 'receive')
                    styleCategory = 'badge badge-success';
                if (value['category'] == 'send')
                    styleCategory = 'badge badge-warning';
                var styleAmount = ''
                if (value['amount'] < 0)
                    styleAmount = 'badge badge-danger';
                else
                    styleAmount = 'badge badge-success';
                var styleConf = ''
                if (value['confirmations'] < 100)
                    styleConf = 'badge badge-warning';
                else
                    styleConf = 'badge badge-success';
                var styleTime = 'badge badge-light'
                var styleTxid = 'badge badge-light'
                json[key]['time'] = '<span class="' + styleTime + '">' + new Date((value['time']) * 1000).toLocaleString('lt-LT', {
                    hour12: false
                }) + '</span>';
                json[key]['category'] = '<span class="' + styleCategory + '">' + value['category'] + '</span>';
                json[key]['txid'] = '<span class="' + styleTxid + '">' + value['txid'] + '</span>';
                json[key]['amount'] = '<span class="' + styleAmount + '">' + value['amount'] + '</span>';
                json[key]['confirmations'] = '<span class="' + styleConf + '">' + value['confirmations'] + '</span>';
            });
            return json;
        },
        error: function(xhr, error, thrown) {
            console.log("transactions table err");
        }
    },
    columns: [{
            data: 'confirmations',
            width: '12%'
        },
        {
            data: 'time',
            width: '20%'
        },
        {
            data: 'category',
            width: '12%'
        },
        {
            data: 'txid',
            width: '12%'
        },
        {
            data: 'amount',
            width: '12%'
        },
    ]
});




// wallets.html
var ctableWallets = $('#wallets-tableWallets').DataTable({
    bInfo: false,
    autoWidth: false,
    searching: false,
    ordering: true,
    responsive: true,
    lengthChange: true,
    processing: false,
    bPaginate: true,
    bLengthChange: false,
    pageLength: 10,
    order: [
        [0, "desc"]
    ],
    ajax: {
        url: process.resourcesPath + '/apidata/WalletsData.json',
        dataSrc: function(json) {

            $.each(json, function(key, value) {
                var styleAmount = ''
                if (value['amount'] < 0)
                    styleAmount = 'badge badge-danger';
                else if (value['amount'] == 0)
                    styleAmount = 'badge badge-warning';
                else
                    styleAmount = 'badge badge-success';
                var styleAccount = ' badge badge-light'
                var styleAddress = 'badge badge-light'
                var styleConf = 'badge badge-success'
                json[key]['account'] = '<span class="' + styleAccount + '">' + value['account'] + '</span>';
                json[key]['amount'] = '<span class="' + styleAmount + '">' + value['amount'] + '</span>';
                json[key]['action'] = '<span onclick="walletsFunc(\'' + value['address'] + '\')"> \
          <img src="assets/images/key.png" class="pointer" data-toggle="tooltip" title="Export PrivKey" alt="key" width="20" height="">\
          </span><span onclick="walletsFunc2(\'' + value['address'] + '\')"> \
          <img src="assets/images/qr-code.png" class="pointer" data-toggle="modal" data-target="#qrcodeWallet" alt="key" width="20" height="">\
          </span><span onclick="walletsFunc3(\'' + value['address'] + '\')"> \
          <img src="assets/images/papers.png" class="pointer" data-toggle="tooltip" title="Copy Wallet addr" alt="key" width="20" height="">\
          </span>'
                json[key]['address'] = '<span class="' + styleAddress + '">' + value['address'] + '</span>';
            });
            return json;
        },
        error: function(xhr, error, thrown) {
            console.log("wallet table err");
        }
    },
    columns: [{
            data: 'account',
            width: '12%'
        },
        {
            data: 'address',
            width: '20%'
        },
        {
            data: 'amount',
            width: '12%'
        },
        {
            data: 'action',
            width: '12%'
        },
    ]
});

setInterval(function() {
    ctableWallets.ajax.reload(null, false); // user paging is not reset on reload
}, 4000);

setInterval(function() {
    ctableTransactions.ajax.reload(null, false); // user paging is not reset on reload
}, 10000);

setInterval(function() {
    ctableStorade.ajax.reload(null, false); // user paging is not reset on reload
}, 60000);

setInterval(function() {
    ctablePeers.ajax.reload(null, false); // user paging is not reset on reload
}, 59000);

setInterval(function() {
    ctableMasternodeList.ajax.reload(null, false); // user paging is not reset on reload
}, 60000);

setInterval(function() {
    ctableIndex.ajax.reload(null, false); // user paging is not reset on reload
}, 60000);

setInterval(function() {
    ctableMasternode.ajax.reload(null, false); // user paging is not reset on reload
}, 15000);