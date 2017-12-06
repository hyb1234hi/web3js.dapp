$( document ).ready(function() {

    // if web3 provider is being injected through mist, 
    // metamask, load it, else use development provider
    if (typeof web3 !== 'undefined') {
        console.log('using injected web3');
        web3 = new Web3(web3.currentProvider);
    } else {
        console.log('using localhost');
        web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
    }

    var entityTrackerContract = getEntityTrackerContract();

    // specify default account
    web3.eth.defaultAccount = web3.eth.accounts[0];

    function getEntityTrackerContract() {
        $.getJSON('EntityTracker.json', function(json) {
            var contract = TruffleContract(json);
            contract.setProvider(web3);
            console.log('contract:');
            console.log(contract);
            return contract;
        });
    }
});