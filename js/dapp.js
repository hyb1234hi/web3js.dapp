App = {
    web3Provider: null,
    contracts: {},
  
    init: function() {
        return App.initWeb3();
    },
  
    initWeb3: function() {
        if (typeof web3 !== 'undefined') {
            App.web3Provider = web3.currentProvider;
            console.log('using metamask provider');
        } else {
            App.web3Provider = new Web3.providers.HttpProvider('http://localhost:8545');
            console.log('no injected web3 instance detected');
        }
        console.log('using account:');
        console.log(web3.eth.accounts[0]);

        web3 = new Web3(App.web3Provider);
        return App.initializeEntityTrackerContract();
    },
  
    initializeEntityTrackerContract: function() {
        $.getJSON('EntityTracker.json').then(function(json) {
            App.contracts.EntityTracker = TruffleContract(json);
            App.contracts.EntityTracker.setProvider(web3);
            console.log('EntityTracker contract initialized:')
            console.log(App.contracts.EntityTracker);
            return App.bindUserInterface();
        });
        return App.watchContractEvent();
    },
  
    watchContractEvent: function() {
        return App.bindEvents();
    },
  
    bindEvents: function() {
        // $(document).on('click', '.btn-adopt', App.handleAdopt);
    },

    bindUserInterface: function() {

    }
  };
  
  $(function() {
    $(window).load(function() {
        App.init();
    });
  });